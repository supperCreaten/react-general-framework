export interface ProfileFormValues {
  nickName?: string
  phonenumber?: string
  email?: string
  sex?: string
}

export interface PasswordFormValues {
  oldPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export interface ProfileUiState {
  activeTab: string
  savingProfile: boolean
  savingPassword: boolean
  uploadingAvatar: boolean
}
