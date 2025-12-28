import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { UserProfile } from '@/Shared/Infrastructure/Common/Gemini/Type/UserProfile';
import { ChatActionsEnum } from '@/Shared/Infrastructure/Common/Enum/ChatActions.enum';

@Injectable()
export class GeminiRecommendationsPrompts {
  generateRecommendationPrompt(
    contextText: string,
    preferences: UserProfile,
    preferredLang: string,
    i18n: I18nService,
    promptConfig: any,
    alternativePrompts: any[] = [],
    logged: boolean = false,
  ) {
    const langTranslated = i18n.translate(`enum.languages.${preferredLang}`, {
      lang: 'es',
    });

    const perspectiveKey = preferences.perspectives?.[0];

    const perspective = perspectiveKey
      ? i18n.translate(`enum.professionalView.${perspectiveKey}`, {
          lang: 'es',
        })
      : 'Guía local';

    const translatedInterests =
      preferences?.interest?.map((key) =>
        i18n.translate(`enum.interest.${key}`, { lang: 'es' }),
      ) ?? [];

    const userProfileArr = [
      preferences?.name ? `- Nombre: ${preferences.name}` : '',
      preferences?.jobTitle ? `- Profesión: ${preferences.jobTitle}` : '',
      preferences?.age ? `- Edad: ${preferences.age}` : '',
      preferences?.nationality
        ? `- Nacionalidad: ${preferences.nationality}`
        : '',
      preferences?.hobbies ? `- Hobbies: ${preferences.hobbies}` : '',
      translatedInterests.length
        ? `- Intereses: ${translatedInterests.join(', ')}`
        : '',
      preferences?.favoriteFoods
        ? `- Comida favorita: ${preferences.favoriteFoods}`
        : '',
      preferences?.medicalConsiderations
        ? `- Consideraciones médicas: ${preferences.medicalConsiderations}`
        : '',
      preferences?.aboutMe ? `- Sobre mí: ${preferences.aboutMe}` : '',
      langTranslated ? `- Idioma preferido: ${langTranslated}` : '',
    ].filter(Boolean);

    const mainGuidelinesArr = [
      'Responde SIEMPRE en el idioma preferido del usuario.',
      'Personaliza tus recomendaciones según el perfil.',
      'No incluyas información sensible ni datos personales.',
      'Utiliza un tono informativo, profesional y amigable.',
    ];

    const contentType =
      promptConfig.types && promptConfig.types.length
        ? `El usuario está consultando sobre ${promptConfig.types
            .map((type: string) =>
              i18n.translate(`enum.content-types.${type}`, { lang: 'es' }),
            )
            .join(', ')}.`
        : '';

    const focus = promptConfig.dataFocus
      ? `**Enfoque de información:** ${promptConfig.dataFocus}`
      : '';

    const additionalInstructions = Array.isArray(promptConfig.extraInstructions)
      ? promptConfig.extraInstructions.join('\n')
      : promptConfig.extraInstructions || '';

    const sourcesHandlingArr = [
      'Debes basar tus respuestas en información verificada y actualizada.',
      'Prioriza siempre fuentes oficiales y confiables: ministerios de turismo, municipalidades, oficinas de turismo, museos, parques nacionales, sitios web oficiales de locales y eventos, y portales de viaje reconocidos, todo referente a LIMA.',
      'No inventes información. Si no hay suficientes datos o la información no es clara, indícalo explícitamente al usuario.',
      'Evita utilizar páginas poco confiables, blogs anónimos o contenido generado por usuarios sin respaldo ni verificación.',
      'Si mencionas precios, horarios o fechas de eventos, aclara que pueden cambiar y recomienda siempre verificar en la web oficial antes de asistir.',
    ];

    let alternativesSection = '';
    if (alternativePrompts.length) {
      alternativesSection = alternativePrompts
        .map(
          (alt, idx) =>
            `[${idx + 1}] ${alt.name} = ${alt.promptIntro.replace(
              '${contextText}',
              contextText,
            )}`,
        )
        .join('\n');
    }

    const instructionsMessage = `El campo "value" debe ser una frase introductoria personalizada, diferente en cada consulta, usando el nombre del usuario si está disponible. No uses siempre el mismo texto, personaliza según el contexto y no debe terminar con dos puntos (:). Además el campo "actions" que traiga máximo 3 resultados relacionados a la conversación.`;

    const exampleJson = `{
  "name": "Consultas sobre Lima",
  "value": "Aquí tienes algunas recomendaciones personalizadas para ti, Henry.",
  "actions": [
    "BUSINESS_TYPICAL_DISHES_TO_TRY",
    "EVENT_CALENDAR_UPCOMING_MAIN"
  ],
  "recommendations": [
    {
      "name": "Visita el Centro Historico de Lima",
      "type": "DESTINY",
      "description": "“El Centro Histórico de Lima es el corazón cultural y colonial de la ciudad. Declarado Patrimonio de la Humanidad por la UNESCO, destaca por sus iglesias barrocas, balcones republicanos y su icónica Plaza Mayor. Es un lugar ideal para recorrer a pie, descubrir su historia y disfrutar de su arquitectura única.",
      "relevantData": [
        "Accesible desde cualquier distrito de Lima",
        "Ideal para recorridos a pie",
        "Perfecto para fotografía arquitectónica y turismo cultural"
      ],
      "link": "https://www.sernanp.gob.pe/huascaran",
      "external": false
    }
  ]
}`;

    const system = [
      `--- SYSTEM PROMPT GENERADO ---`,
      `Eres un asistente para el rubro de turismo, especializado como profesional de **${perspective}**.`,
      `Tu tarea es proporcionar recomendaciones y sugerencias sobre **"${contextText}"**.`,
      `Actúas como parte de una conversación continua, respondiendo de manera útil y personalizada.`,
      ``,
      `### Perfil del Usuario:`,
      userProfileArr.join('\n'),
      ``,
      `### Directrices Principales:`,
      mainGuidelinesArr.join('\n'),
      ``,
      contentType,
      focus,
      additionalInstructions
        ? `**Instrucciones Adicionales:**\n${additionalInstructions}`
        : '',
      ``,
      `### Información de Consulta:`,
      `- Puedes usar tu conocimiento general y fuentes públicas de Internet para complementar la respuesta.`,
      `- Prioriza siempre sitios oficiales de turismo, instituciones públicas, operadores turísticos reconocidos y portales de turismo confiables de LIMA.`,
      ``,
      ``,
      `### Manejo de Fuentes en Internet:`,
      `Cuando necesites datos concretos (horarios, precios, direcciones, fechas de eventos), apóyate en páginas web confiables y actualizadas.`,
      sourcesHandlingArr.join('\n'),
      ``,
      `### Formato de Salida:`,
      `Si no tiene nombre el chat, debemos generar un campo llamado "name", este campo debe ser un **nombre conciso para la conversación en el idioma de la respuesta** (máximo 5-10 palabras).`,
      `Devuelve la respuesta exclusivamente en formato JSON bajo la clave "recommendations".`,
      instructionsMessage,
      `Cada objeto dentro del array "recommendations" debe incluir un campo llamado "name". Este campo debe ser un **título conciso y atractivo en "${langTranslated}"** (máximo 5-7 palabras) que resuma la recomendación para su visualización en el chat.`,
      `Cada objeto dentro del array "actions" ahora tendrá las claves "code" (con el código de acción existente).`,
      `Aquí tienes el formato JSON esperado:`,
      exampleJson,
      '',
      alternativesSection
        ? `### Sugerencias para el Usuario (Accesos Directos):\nConsidera recomendar al usuario hasta dos de estas preguntas de seguimiento relevantes para continuar la conversación (Si no aplica, no incluyas esta sección):\n${alternativesSection}`
        : '',
      '',
      `En caso no encuentres respuestas para responder o no tengas fuentes confiables, comparte el mismo formato de response pero vacío con una acción a recomendar. Puedes usar alguna de estas acciones según el contexto:
  - "${ChatActionsEnum.UPDATE_PREFERENCES}": Si el usuario podría mejorar sus recomendaciones actualizando sus preferencias.
  ${!logged ? `- "${ChatActionsEnum.SIGN_IN}": Si el usuario necesita registrarse o ingresar para recibir ayuda personalizada y actualizar su perfil.` : ''}
      Nunca incluyas valores vacíos en el array de actions.
      El campo "value" debe ser una frase personalizada y relevante para el usuario para que pueda realizar las siguientes acciones que le compartas.

      Ejemplo:
      {
        "name": null,
        "value": "Lo sentimos, no encontramos recomendaciones personalizadas para ti, Juan. Podrías darnos más contexto, actualizar tus preferencias, iniciar un plan de viaje${!logged ? ' o registrarte para recibir ayuda personalizada' : ''}.",
        "actions": ["UPDATE_PREFERENCES", ${!logged ? '"SIGN_IN"' : ''}],
        "recommendations": []
      }`,
    ]
      .filter(Boolean)
      .join('\n');

    const user = `--- USER PROMPT GENERADO ---
Genera la respuesta JSON siguiendo estrictamente el formato especificado. No incluyas texto adicional ni markdown fuera del JSON.`;

    return { system, user };
  }
}
