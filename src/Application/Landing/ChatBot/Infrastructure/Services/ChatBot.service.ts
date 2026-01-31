import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from '@/Shared/Infrastructure/Common/Dto/Auth.dto';
import { StoreChatDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/StoreChatBot.dto';
import { UserRepository } from '@/Application/Common/User/Infrastructure/Repositories/User.repository';
import { I18nService } from 'nestjs-i18n';
import {
  ChatPreferences,
  synthesizeTextWithGoogle,
  transcribeAudioWithGoogle,
} from '@/Application/Landing/ChatBot/Infrastructure/Utils/Chat.utils';
import { ChatBotRepository } from '@/Application/Landing/ChatBot/Infrastructure/Repositories/ChatBot.respository';
import { Types } from 'mongoose';
import { messageI18n } from '@/Shared/Infrastructure/Helper/I18n.helper';
import { ChatMemoryDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatMemory.dto';
import { ChatModelsEnum } from '@/Shared/Infrastructure/Common/Enum/ChatModels.enum';
import { SystemMessageEnum } from '@/Shared/Infrastructure/Common/Enum/SystemMessage.enum';
import { ChatIdDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatId.dto';
import { MessagesDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/Message.dto';
import { PerspectiveService } from '@/Shared/Infrastructure/Interceptor/GeminiInterceptor/PerspectiveService';
import { CreditsRepository } from '@/Application/Landing/Credits/Infrastructure/Repositories/Credits.repository';
import { GeminiService } from '@/Shared/Infrastructure/Common/Gemini/Service/Gemini.service';
import { ChatPaginationDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/ChatPagination.dto';
import { CREDIT_COSTS } from '@/Application/BackOffice/Subscriptions/Infrastructure/Strategy/Subscription.strategy';
import { RecommendationDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/Recommendation.dto';
import { UserProfile } from '@/Shared/Infrastructure/Common/Gemini/Type/UserProfile';
import { Logger } from '@/Shared/Infrastructure/Logger/Logger';
import { ChatActionsEnum } from '@/Shared/Infrastructure/Common/Enum/ChatActions.enum';
import { AudioInterface } from '@/Application/Landing/ChatBot/Job/Interface/Audio.interface';
import { TextToSpeechDto } from '@/Application/Landing/ChatBot/Infrastructure/Dto/TexttoSpeech.dto';
import { ChatbotImageUploadInterface } from '@/Application/Landing/ChatBot/Infrastructure/Interfaces/ChatbotImageUpload.interface';
import { imageChatbotUpload } from '@/Shared/Infrastructure/Common/Upload/imageChatbot,upload';
import {
  GeminiPart,
  messageToText,
  toGeminiMsgFromDb,
} from '@/Shared/Infrastructure/Common/Gemini/Utils/ChatGeminiCompletion.utils';
import { RagQueryUseCase } from '@/Application/Landing/Rag/Application/RagUseCase/RagQuery.useCase';
import { ChatMetricsRepository } from '@/Application/Landing/ChatBot/Infrastructure/Repositories/ChatMetrics.repository';

@Injectable()
export class ChatBotService {
  constructor(
    private readonly chatBotRepository: ChatBotRepository,
    private readonly geminiService: GeminiService,
    private readonly perspectiveService: PerspectiveService,
    private readonly userRepository: UserRepository,
    private readonly creditsRepository: CreditsRepository,
    private readonly i18n: I18nService,
    private readonly ragQueryUseCase: RagQueryUseCase,
    private readonly chatMetricsRepository: ChatMetricsRepository,
  ) {}

  async createChat(
    authDto: AuthDto | null,
    storeChatDto: StoreChatDto,
  ): Promise<{
    chat: ChatPreferences;
    justCreated: boolean;
  }> {
    const userId = authDto?._id ? authDto._id.toString() : null;

    let chat = await this.chatBotRepository.findChat({
      deviceId: storeChatDto.deviceId,
      userId,
    });

    let justCreated = false;

    if (!chat) {
      chat = await this.chatBotRepository.createChat(authDto, storeChatDto);
      justCreated = true;
    }

    let preferences: Omit<ChatPreferences, '_id' | 'user'> = {
      medicalConsiderations: chat.medicalConsiderations || '',
      favoriteFoods: chat.favoriteFoods || '',
      jobTitle: chat.jobTitle || '',
      funFact: chat.funFact || '',
      perspectives: chat.perspectives || [],
      voiceTones: chat.voiceTones || [],
    };

    if (chat.user && authDto?._id) {
      const userDoc = await this.chatBotRepository.findUserProfileById(
        authDto._id,
      );
      if (userDoc) {
        preferences = {
          medicalConsiderations: userDoc.medicalConsiderations || '',
          favoriteFoods: userDoc.favoriteFoods || '',
          jobTitle: userDoc.jobTitle || '',
          funFact: userDoc.funFact || '',
          perspectives: userDoc.perspectives || [],
          voiceTones: userDoc.voiceTones || [],
        };
      }
    }

    return {
      chat: {
        _id: chat._id,
        ...preferences,
        user: chat.user ?? false,
      },

      justCreated,
    };
  }

  async createNewChat(
    authDto: AuthDto,
    storeChatDto: StoreChatDto,
  ): Promise<{
    chat: { _id: Types.ObjectId };
  }> {
    const currentChat = await this.chatBotRepository.findChatBot({
      current: true,
      deviceId: storeChatDto.deviceId,
    });

    if (currentChat) {
      await this.chatBotRepository.setCurrentFalse(currentChat._id);
    }

    const chat = await this.chatBotRepository.createChatWithCurrent(
      authDto,
      storeChatDto,
      true,
    );

    return {
      chat: { _id: chat._id },
    };
  }

  async chatMemory(
    authDto: AuthDto,
    chatMemoryDto: ChatMemoryDto,
  ): Promise<any> {
    const {
      chatId,
      funFact,
      jobTitle,
      favoriteFoods,
      medicalConsiderations,
      perspectives,
      voiceTones,
      deviceId,
      user,
    } = chatMemoryDto;

    const chat = await this.chatBotRepository.findChatById(chatId);
    if (!chat) {
      throw new NotFoundException(
        messageI18n(this.i18n, 'validation.not_results_found'),
      );
    }

    if (typeof user !== 'undefined') {
      chat.user = user;
    }

    if (user === true && authDto?._id) {
      const userDocument = await this.userRepository.findById(authDto._id);
      if (!userDocument) {
        throw new NotFoundException(
          messageI18n(this.i18n, 'validation.user_not_found'),
        );
      }

      let update = false;
      if (typeof perspectives !== 'undefined') {
        userDocument.perspectives = perspectives;
        update = true;
      }
      if (typeof voiceTones !== 'undefined') {
        userDocument.voiceTones = voiceTones;
        update = true;
      }
      if (update) await userDocument.save();
    } else {
      if (typeof funFact !== 'undefined') chat.funFact = funFact;
      if (typeof jobTitle !== 'undefined') chat.jobTitle = jobTitle;
      if (typeof favoriteFoods !== 'undefined')
        chat.favoriteFoods = favoriteFoods;
      if (typeof medicalConsiderations !== 'undefined')
        chat.medicalConsiderations = medicalConsiderations;
      if (typeof perspectives !== 'undefined') chat.perspectives = perspectives;
      if (typeof voiceTones !== 'undefined') chat.voiceTones = voiceTones;
      if (typeof deviceId !== 'undefined') chat.deviceId = deviceId;
    }

    chat.updatedAt = new Date();

    await chat.save();

    const message = await this.chatBotRepository.saveMessage({
      chatId: new Types.ObjectId(chat._id),
      role: 'system',
      value: 'MEMORY_UPDATED',
      deviceId: chat.deviceId,
      createdAt: new Date(),
    });

    return {
      data: {
        _id: (message as any)._id,
        role: message.role,
        value: message.value,
        createdAt: message.createdAt,
      },
    };
  }

  async chatBotConversation(
    authDto: AuthDto,
    chatIdDto: ChatIdDto,
    messagesDto: MessagesDto,
  ): Promise<any> {
    const text = (messagesDto.value ?? '').trim();
    const file = (messagesDto as any).file ?? null;

    if (!text && !file) {
      throw new BadRequestException('Debe enviar un mensaje o una imagen.');
    }

    // ==========================
    // ✅ VARIABLES MÉTRICAS (FUERA DEL TRY PARA USAR EN FINALLY)
    // ==========================
    const requestAt = new Date();
    const startMs = Date.now();

    const deviceIdMetric = messagesDto.deviceId ?? '';
    const channel: 'web' | 'whatsapp' = deviceIdMetric.startsWith('wa_')
      ? 'whatsapp'
      : 'web';
    const hasImage = Boolean(file);

    let resolved = false;
    let errorCode: string | null = null;
    let usedModel: ChatModelsEnum | null = null;

    // para poder guardar en finally sin “scope errors”
    let toxicity: number | null = null;
    let chatObjectId: Types.ObjectId | null = null;

    try {
      // ==========================
      // ✅ TU LÓGICA ORIGINAL (IGUAL)
      // ==========================
      toxicity = text ? await this.perspectiveService.analyzeToxicity(text) : 0;

      chatObjectId =
        chatIdDto.chatId instanceof Types.ObjectId
          ? chatIdDto.chatId
          : new Types.ObjectId(String(chatIdDto.chatId));

      if (chatIdDto.chatId) {
        const chatCheck =
          await this.chatBotRepository.findChatById(chatObjectId);

        if (!chatCheck) {
          throw new NotFoundException(
            messageI18n(this.i18n, 'validation.chat_not_found'),
          );
        }

        if (authDto?._id) {
          if (String(chatCheck.createdBy._id) !== String(authDto._id)) {
            throw new ForbiddenException(
              messageI18n(this.i18n, 'validation.you_dont_have_access'),
            );
          }
        }
      }

      const createdBy = authDto?._id
        ? {
            _id: authDto._id,
            names: authDto.names ?? 'Anonymous',
            lastNames: authDto.lastNames ?? '',
            picture: authDto.picturePath ?? null,
          }
        : {
            _id: null,
            names: 'Anonymous',
            lastNames: '',
            picture: null,
          };

      if ((toxicity ?? 0) > 0.7) {
        // blocked => NO resuelto
        return {
          _id: null,
          role: 'system',
          value: SystemMessageEnum.MESSAGE_BLOCKED_FOR_TOXICITY.toString(),
          actions: [],
        };
      }

      if (text && text.length > 1000) {
        return {
          _id: null,
          role: 'system',
          value: SystemMessageEnum.MESSAGE_TOO_LONG.toString(),
          actions: [],
        };
      }

      const chat = await this.chatBotRepository.findChatById(chatObjectId);
      if (!chat) {
        throw new NotFoundException(
          messageI18n(this.i18n, 'validation.chat_not_found'),
        );
      }

      if (authDto?._id) {
        const updatedCredit = await this.creditsRepository.consumeCreditDynamic(
          authDto,
          CREDIT_COSTS.CHAT_SIMPLE,
        );

        if (!updatedCredit) {
          const message = await this.chatBotRepository.saveMessage({
            chatId: chatObjectId,
            role: 'system',
            value: SystemMessageEnum.CREDITS_SOLD_OUT.toString(),
            createdAt: new Date(),
          });

          return {
            _id: (message as any)._id,
            role: message.role,
            value: message.value,
            actions: [],
            createdAt: message.createdAt,
          };
        }
      }

      let uploadedImage: any = null;
      let inlineImagePart: GeminiPart | null = null;

      if (file) {
        if (!authDto?._id) {
          throw new UnauthorizedException(
            messageI18n(this.i18n, 'validation.user_not_authenticated'),
          );
        }

        const fileForUpload = file?.bufferBase64
          ? { ...file, buffer: Buffer.from(file.bufferBase64, 'base64') }
          : file;

        uploadedImage = await imageChatbotUpload(
          fileForUpload,
          authDto._id,
          chatObjectId,
        );

        inlineImagePart = {
          inlineData: {
            mimeType: file.mimetype,
            data: file.bufferBase64,
          },
        };
      }

      await this.chatBotRepository.saveMessage({
        chatId: chatObjectId,
        role: 'user',
        value: file
          ? {
              text,
              image: {
                url: uploadedImage?.fullUrl ?? null,
                key: uploadedImage?.key ?? null,
                mimeType: uploadedImage?.mimeType ?? file.mimetype,
                size: uploadedImage?.size ?? file.size,
              },
            }
          : text,
        toxicity: toxicity ?? 0,
        createdBy,
        deviceId: messagesDto.deviceId,
        createdAt: new Date(),
      });

      const history = await this.chatBotRepository.getRecentMessages(
        chatObjectId,
        9,
      );

      const historyWithoutLastUser =
        history.length && history[history.length - 1]?.role === 'user'
          ? history.slice(0, -1)
          : history;

      const historyParts = historyWithoutLastUser
        .map((msg: any) => {
          if (msg.role === 'system') {
            const t = messageToText(msg.value).trim();
            return t ? ({ role: 'model', parts: [{ text: t }] } as any) : null;
          }
          return toGeminiMsgFromDb(msg);
        })
        .filter(Boolean) as Array<{
        role: 'user' | 'model';
        parts: GeminiPart[];
      }>;

      const deviceId = messagesDto.deviceId ?? '';
      const isWhatsApp = deviceId.startsWith('wa_');

      const ragHits =
        !isWhatsApp && text ? await this.ragQueryUseCase.search(text, 4) : [];

      const ragContext = ragHits.length
        ? `\n\n### CONTEXTO (RAG)\n${ragHits.map((h) => `- ${h}`).join('\n')}\n`
        : '';

      const alternativePrompts =
        await this.chatBotRepository.getAllActivePrompts();
      const alternativesSection = alternativePrompts?.length
        ? alternativePrompts.map((row) => `- ${row.name.toString()}`).join('\n')
        : '';

      const systemPrompt = isWhatsApp
        ? `
Eres un experto en turismo en Lima. Responde SIEMPRE en español.
Devuelve SOLO TEXTO PLANO (sin JSON, sin markdown).
No uses asteriscos (*), ni títulos con #, ni backticks.
Sé claro, natural y útil.
Máximo 6-8 líneas. Si listás, usa viñetas con "-" (guion).
`.trim()
        : `
Eres un experto en turismos en Lima. Responde SIEMPRE en español de forma clara y útil.

La respuesta debe ser un JSON válido, sin texto adicional fuera del JSON.
El JSON debe tener siempre las claves "value" y "actions".
"value" es un string con la respuesta a la conversación actual.
"actions" es un arreglo (array) de strings con posibles acciones o preguntas de seguimiento.
Si no hay acciones, "actions" debe ser un arreglo vacío ([]).

IMPORTANTE:
Ten en cuenta que esta respuesta forma parte de una conversación y que recibes el hilo completo.

${alternativesSection ? `### Sugerencias:\n${alternativesSection}\n` : ''}

Ejemplo:
{ "value": "Aquí está la información que solicitaste.", "actions": ["DESTINY_FIND_BEST_VIEWS"] }

${ragContext ? ragContext : ''}

Responde SOLO con ese JSON.
`.trim();

      const currentUserParts: GeminiPart[] = [];
      if (text) currentUserParts.push({ text });
      if (inlineImagePart) currentUserParts.push(inlineImagePart);
      if (!currentUserParts.length) currentUserParts.push({ text: '' });

      const finalConversation = [
        ...historyParts,
        { role: 'user', parts: currentUserParts },
      ];

      // ==========================
      // ✅ AQUÍ SE MIDE EL TIEMPO REAL (TMR)
      // ==========================
      let geminiContent = await this.geminiService.chatWithHistory(
        finalConversation as any,
        systemPrompt,
      );

      // si llegó hasta aquí => hay respuesta del modelo
      resolved = true;
      usedModel = ChatModelsEnum.GEMINI_2_5_FLASH;

      if (isWhatsApp) {
        let plain =
          typeof geminiContent === 'string'
            ? geminiContent
            : typeof geminiContent?.value === 'string'
              ? geminiContent.value
              : '';

        plain = plain
          .replace(/```[\s\S]*?```/g, '')
          .replace(/[*_`]/g, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        const MAX_WA = 1200;
        if (plain.length > MAX_WA) plain = plain.slice(0, MAX_WA).trim() + '…';

        geminiContent = plain;
      }

      const MAX_LENGTH = 1000;
      if (
        typeof geminiContent === 'string' &&
        geminiContent.length > MAX_LENGTH
      ) {
        geminiContent = geminiContent.slice(0, MAX_LENGTH);
      }

      if (geminiContent && typeof geminiContent === 'object') {
        const obj = geminiContent as Record<string, any>;
        if ('name' in obj && obj.name && chatIdDto.chatId) {
          await this.ensureChatName(chatIdDto.chatId, obj.name);
          delete obj.name;
        }
      }

      const modelMessage = await this.chatBotRepository.saveMessage({
        chatId: chatObjectId,
        role: 'model',
        value: geminiContent,
        model: ChatModelsEnum.GEMINI_2_5_FLASH,
        deviceId: messagesDto.deviceId,
        createdAt: new Date(),
      });

      if (isWhatsApp) {
        return {
          _id: (modelMessage as any)._id,
          role: 'model',
          value: geminiContent,
          actions: [],
          createdAt: (modelMessage as any).createdAt,
        };
      }

      const value =
        typeof geminiContent === 'object' &&
        geminiContent !== null &&
        Object.prototype.hasOwnProperty.call(geminiContent, 'value')
          ? (geminiContent as Record<string, any>).value
          : geminiContent;

      const actions =
        typeof geminiContent === 'object' &&
        geminiContent !== null &&
        Object.prototype.hasOwnProperty.call(geminiContent, 'actions')
          ? Array.isArray((geminiContent as Record<string, any>).actions)
            ? (geminiContent as Record<string, any>).actions.map((act: any) =>
                typeof act === 'string' ? act : act?.name,
              )
            : []
          : [];

      return {
        _id: (modelMessage as any)._id,
        role: 'model',
        value,
        actions,
        createdAt: (modelMessage as any).createdAt,
      };
    } catch (e: any) {
      resolved = false;
      errorCode = e?.name || 'UNKNOWN_ERROR';
      throw e;
    } finally {
      try {
        if (chatObjectId) {
          const responseAt = new Date();
          const responseTimeMs = Math.max(0, Date.now() - startMs);

          const userId = authDto?._id ? new Types.ObjectId(authDto._id) : null;

          await this.chatMetricsRepository.create({
            chatId: chatObjectId,
            userId,
            deviceId: deviceIdMetric,
            channel,
            requestAt,
            responseAt,
            responseTimeMs,
            resolved,
            hasImage,
            toxicity: typeof toxicity === 'number' ? toxicity : null,
            model: usedModel ?? null,
            errorCode,
          });
        }
      } catch {
        // no romper el chat si falla métrica
      }
    }
  }

  async generateRecommendations(
    authDto: AuthDto,
    recommendationDto: RecommendationDto,
  ): Promise<any> {
    const { action, chatId } = recommendationDto;

    let chat = null;

    if (chatId) {
      chat = await this.chatBotRepository.findChatById(chatId);
      if (!chat)
        throw new NotFoundException(
          messageI18n(this.i18n, 'validation.chat_not_found'),
        );

      if (authDto?._id) {
        if (String(chat.createdBy?._id) !== String(authDto._id)) {
          throw new ForbiddenException(
            messageI18n(this.i18n, 'validation.you_dont_have_access'),
          );
        }
      }
    }

    const creditAuth: AuthDto = {
      ...authDto,
      _id: chat?.businessPath ? null : authDto?._id,
    };

    if (creditAuth._id) {
      const updatedCredit = await this.creditsRepository.consumeCreditDynamic(
        creditAuth,
        CREDIT_COSTS.PERSONALIZED_RECOMMENDATIONS,
      );

      if (!updatedCredit) {
        const message = await this.chatBotRepository.saveMessage({
          chatId: new Types.ObjectId(recommendationDto.chatId),
          role: 'system',
          value: SystemMessageEnum.CREDITS_SOLD_OUT.toString(),
          createdAt: new Date(),
        });

        return {
          _id: (message as any)._id,
          role: message.role,
          value: message.value,
          createdAt: message.createdAt,
        };
      }
    }

    const allPrompts = await this.chatBotRepository.getAllActivePrompts();
    const promptRequested = allPrompts.find((p) => p.name === action);
    const alternativePrompts = allPrompts.filter((p) => p.name !== action);

    if (!promptRequested)
      throw new NotFoundException(
        messageI18n(this.i18n, 'validation.not_results_found'),
      );

    let preferences: UserProfile | null = null;

    if (authDto?._id) {
      const userProfile = await this.chatBotRepository.findUserProfileById(
        authDto._id,
      );

      if (this.hasUserPreferences(userProfile as any)) {
        preferences = userProfile as any;
      }
    }

    if (!preferences && chatId) {
      const chatPrefs = await this.chatBotRepository.getChatPreferences(chatId);

      preferences = {
        name: '',
        jobTitle: (chatPrefs as any).jobTitle ?? '',
        interest: [],
        hobbies: '',
        languages: ['ES'],
        aboutMe: '',
        age: null,
        nationality: 'Perú',
        favoriteFoods: (chatPrefs as any).favoriteFoods ?? '',
        medicalConsiderations: (chatPrefs as any).medicalConsiderations ?? '',
        funFact: (chatPrefs as any).funFact ?? '',
        perspectives: (chatPrefs as any).perspectives ?? [],
        voiceTones: (chatPrefs as any).voiceTones ?? [],
      };
    }

    if (!preferences) {
      preferences = {
        name: '',
        jobTitle: '',
        interest: [],
        hobbies: '',
        languages: ['ES'],
        aboutMe: '',
        age: null,
        nationality: 'Perú',
        favoriteFoods: '',
        medicalConsiderations: '',
        funFact: '',
        perspectives: [],
        voiceTones: [],
      };
    }

    const preferredLang = preferences?.languages?.[0] ?? 'ES';

    try {
      let contextText = '';
      if (promptRequested?.promptIntro)
        contextText = promptRequested.promptIntro;
      else if (promptRequested?.shortIntro)
        contextText = promptRequested.shortIntro;
      else if (promptRequested?.name) contextText = promptRequested.name;

      const aiResponse = await this.geminiService.recommendTravelHighlights(
        contextText,
        preferences,
        preferredLang,
        promptRequested,
        alternativePrompts,
        Boolean(authDto?._id),
      );

      if (
        aiResponse &&
        typeof aiResponse === 'object' &&
        aiResponse.name &&
        chatId
      ) {
        await this.ensureChatName(chatId, aiResponse.name);
        delete aiResponse.name;
      }

      if (
        !aiResponse ||
        typeof aiResponse !== 'object' ||
        !Array.isArray(aiResponse.recommendations) ||
        aiResponse.recommendations.length === 0
      ) {
        return {
          value: SystemMessageEnum.NO_RECOMMENDATIONS_FOUND.toString(),
          actions: [ChatActionsEnum.UPDATE_PREFERENCES.toString()],
          recommendations: [],
          createdAt: new Date(),
        };
      }

      if (
        aiResponse &&
        typeof aiResponse === 'object' &&
        Array.isArray(aiResponse.recommendations)
      ) {
        let actions: string[] = [];

        if (Array.isArray(aiResponse.actions)) {
          actions = aiResponse.actions
            .map((a: any) => (typeof a === 'string' ? a : a?.code))
            .filter(Boolean);
        }

        actions = actions.slice(0, 3);

        if (!authDto?._id && !actions.includes(ChatActionsEnum.SIGN_IN)) {
          actions.push(ChatActionsEnum.SIGN_IN);
        }

        const savedMessage = await this.chatBotRepository.saveMessage({
          chatId: chatId ? new Types.ObjectId(chatId) : null,
          role: 'model',
          value: {
            value: aiResponse.value,
            actions,
            recommendations: aiResponse.recommendations.map(
              (rec: any, idx: number) => ({
                ...rec,
                external: idx === 0 ? false : rec.external,
              }),
            ),
          } as any,
          model: ChatModelsEnum.GEMINI_2_5_FLASH,
          deviceId: recommendationDto.deviceId,
          createdAt: new Date(),
        });

        aiResponse.recommendations = aiResponse.recommendations.map(
          (rec: any, idx: number) => ({
            ...rec,
            external: idx === 0 ? false : rec.external,
          }),
        );

        return {
          _id: (savedMessage as any)._id?.toString(),
          value: aiResponse.value,
          actions,
          recommendations: aiResponse.recommendations,
          createdAt: savedMessage.createdAt,
        };
      }

      return null;
    } catch (error: any) {
      new Logger().errorMessage('Error prompt request', error.message);
      return {
        value: SystemMessageEnum.RECOMMENDATION_GENERATION_FAILED.toString(),
        actions: [],
        recommendations: [],
        createdAt: new Date(),
      };
    }
  }

  private async ensureChatName(chatId: Types.ObjectId, name: string) {
    if (!chatId || !name) return;
    const chat = await this.chatBotRepository.findChatById(chatId);
    if (chat && (!chat.name || chat.name.trim() === '')) {
      await this.chatBotRepository.updateChatName(chat._id, name);
    }
  }

  private hasUserPreferences(profile: UserProfile | null | undefined): boolean {
    if (!profile) return false;

    return Boolean(
      (profile.jobTitle ?? '').trim() ||
        (profile.favoriteFoods ?? '').trim() ||
        (profile.medicalConsiderations ?? '').trim() ||
        (profile.funFact ?? '').trim() ||
        (Array.isArray(profile.perspectives) &&
          profile.perspectives.length > 0) ||
        (Array.isArray(profile.voiceTones) && profile.voiceTones.length > 0),
    );
  }

  async detailChat(
    authDto: AuthDto,
    chatIdDto: ChatIdDto,
    chatPaginationDto: ChatPaginationDto,
  ): Promise<any> {
    const chat = await this.chatBotRepository.findChatById(chatIdDto.chatId);
    if (!chat) {
      throw new NotFoundException(
        messageI18n(this.i18n, 'validation.not_results_found'),
      );
    }

    if (chat.createdBy && chat.createdBy._id) {
      if (
        !authDto?._id ||
        chat.createdBy._id.toString() !== authDto._id.toString()
      ) {
        throw new ForbiddenException(
          messageI18n(this.i18n, 'validation.you_dont_have_access'),
        );
      }
    }

    const page = chatPaginationDto.page;
    const pageSize = chatPaginationDto.pageSize;

    const { messages, total } =
      await this.chatBotRepository.findMessagesByChatIdPaginated(
        chat._id,
        page,
        pageSize,
      );

    const items = messages.map((msg) => {
      const base = {
        _id: (msg as any)._id?.toString(),
        createdAt: msg.createdAt,
        role: msg.role,
      };
      if (typeof msg.value === 'string') {
        return {
          ...base,
          value: msg.value,
        };
      } else if (typeof msg.value === 'object' && msg.value !== null) {
        return {
          ...base,
          ...msg.value,
        };
      } else {
        return {
          ...base,
          value: msg.value,
        };
      }
    });

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
  }

  async messageAudio(
    authDto: AuthDto,
    audioInterface: AudioInterface,
  ): Promise<{ transcript: string }> {
    const { file } = audioInterface;

    if (!authDto?._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.user_not_authenticated'),
      );
    }

    let transcript: string;
    try {
      transcript = await transcribeAudioWithGoogle(file);
    } catch (e: any) {
      throw new BadRequestException(e?.message || 'Audio transcription failed');
    }

    await this.creditsRepository.consumeCreditDynamic(
      authDto,
      CREDIT_COSTS.AUDIO,
    );

    await this.chatBotRepository.saveMessage({
      chatId: authDto._id,
      role: 'user',
      value: transcript,
      createdBy: {
        _id: authDto._id,
        names: authDto.names,
        lastNames: authDto.lastNames,
        picture: authDto.picturePath,
      },
    });

    return { transcript };
  }

  async messageTts(authDto: any, dto: TextToSpeechDto) {
    if (!authDto?._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.user_not_authenticated'),
      );
    }

    let audioBuffer: Buffer;
    let mimeType: string;

    try {
      const result = await synthesizeTextWithGoogle({
        text: dto.text,
        languageCode: dto.languageCode ?? 'es-PE',
        voiceName: dto.voiceName,
        format: dto.format ?? 'mp3',
        speakingRate: dto.speakingRate ?? 1.0,
        pitch: dto.pitch ?? 0,
      });

      audioBuffer = result.buffer;
      mimeType = result.mimeType;
    } catch (e: any) {
      throw new BadRequestException(e?.message || 'Text to speech failed');
    }

    await this.creditsRepository.consumeCreditDynamic(
      authDto,
      CREDIT_COSTS.AUDIO,
    );

    await this.chatBotRepository.saveMessage({
      chatId: authDto._id,
      role: 'system',
      value: dto.text,
      createdBy: {
        _id: authDto._id,
        names: authDto.names,
        lastNames: authDto.lastNames,
        picture: authDto.picturePath,
      },
    });

    return { audioBuffer, mimeType };
  }

  async uploadChatbotImage(
    authDto: AuthDto,
    chatIdDto: ChatIdDto,
    chatbotImageUploadInterface: ChatbotImageUploadInterface,
  ) {
    if (!authDto?._id) {
      throw new UnauthorizedException(
        messageI18n(this.i18n, 'validation.user_not_authenticated'),
      );
    }
    const userId = authDto._id;
    const { chatId } = chatIdDto;
    const { file } = chatbotImageUploadInterface;

    return imageChatbotUpload(file, userId, chatId);
  }
}
