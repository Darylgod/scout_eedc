export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  CHEF: 'chef',
}

export const BRANCHES = {
  louveteaux: { label: 'Louveteaux', age: '7-11 ans', color: '#FFD93D', emoji: '🐺' },
  eclaireurs: { label: 'Éclaireurs', age: '11-15 ans', color: '#1A7A4A', emoji: '⚡' },
  pionniers: { label: 'Pionniers', age: '15-18 ans', color: '#003087', emoji: '🏗️' },
  routiers: { label: 'Routiers', age: '18-22 ans', color: '#CC0000', emoji: '🌍' },
}

export const ARTICLE_CATEGORIES = [
  { value: 'camp', label: 'Camp', icon: '⛺' },
  { value: 'ceremonie', label: 'Cérémonie', icon: '🎖️' },
  { value: 'odd', label: 'ODD', icon: '🌍' },
  { value: 'formation', label: 'Formation', icon: '📚' },
  { value: 'evenement', label: 'Événement', icon: '📅' },
  { value: 'autre', label: 'Autre', icon: '📝' },
]

export const RESOURCE_TYPES = [
  { value: 'document', label: 'Document', icon: '📄' },
  { value: 'video', label: 'Vidéo', icon: '🎬' },
  { value: 'audio', label: 'Audio', icon: '🎵' },
  { value: 'lien', label: 'Lien', icon: '🔗' },
]

export const RESOURCE_CATEGORIES = [
  { value: 'technique', label: 'Technique' },
  { value: 'pedagogique', label: 'Pédagogique' },
  { value: 'administratif', label: 'Administratif' },
  { value: 'formation', label: 'Formation' },
]

export const EVENT_TYPES = [
  { value: 'camp', label: 'Camp', icon: '⛺' },
  { value: 'reunion', label: 'Réunion', icon: '🤝' },
  { value: 'formation', label: 'Formation', icon: '📚' },
  { value: 'ceremonie', label: 'Cérémonie', icon: '🎖️' },
  { value: 'activite', label: 'Activité', icon: '🎯' },
]

export const ANNOUNCE_TYPES = [
  { value: 'info', label: 'Information', color: '#003087' },
  { value: 'important', label: 'Important', color: '#D4A017' },
  { value: 'urgence', label: 'Urgence', color: '#CC0000' },
]