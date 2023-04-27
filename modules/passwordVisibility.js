export function togglePasswordVisibility(inputElement, eyeOpenElement, eyeCloseElement) {
  eyeCloseElement.style.display = 'none';
  eyeOpenElement.style.display = 'block';
  inputElement.type = 'text';
}

export function togglePasswordInvisibility(inputElement, eyeOpenElement, eyeCloseElement) {
  eyeCloseElement.style.display = 'block';
  eyeOpenElement.style.display = 'none';
  inputElement.type = 'password';
}