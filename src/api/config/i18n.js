import request from '@/utils/request'
export function loadLang (lang) {
  return request.get(`/config/i18n/${lang}.json`)
}
