export enum SystemMessageEnum {
  FREE_QUESTIONS_EXCEEDED = 'FREE_QUESTIONS_EXCEEDED', //"Has agotado tus preguntas gratuitas. Actualiza tu plan o compra créditos para continuar usando el chatbot."
  USER_NOT_REGISTERED = 'USER_NOT_REGISTERED', //"No tienes una cuenta activa. Por favor, regístrate para usar el chatbot.
  CREDITS_SOLD_OUT = 'CREDITS_SOLD_OUT', //"No tienes créditos suficientes. Compra créditos o renueva tu suscripción para continuar usando el chatbot."
  MESSAGE_BLOCKED_FOR_TOXICITY = 'MESSAGE_BLOCKED_FOR_TOXICITY', //'Mensaje bloqueado por contenido inapropiado.'
  MESSAGE_TOO_LONG = 'MESSAGE_TOO_LONG', //'Mensaje demasiado largo. Usa menos de 1000 caracteres.'
  NO_INFORMATION_AVAILABLE = 'NO_INFORMATION_AVAILABLE', //'Lo sentimos, no tenemos información disponible para este tipo de contenido en este momento.'
  NO_RECOMMENDATIONS_FOUND = 'NO_RECOMMENDATIONS_FOUND', //'No se encontraron recomendaciones para tu búsqueda, intenta con otra palabra o actualiza tus preferencias.'
  RECOMMENDATION_GENERATION_FAILED = 'RECOMMENDATION_GENERATION_FAILED', //'Ha ocurrido un error al generar recomendaciones. Por favor, intenta nuevamente más tarde.'
}
