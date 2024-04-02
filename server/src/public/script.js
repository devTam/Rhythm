const getById = (id) => document.getElementById(id)

const password = getById("password")
const confirmPassword = getById("confirm-password")
const form = getById("form")
const container = getById("container")
const loader = getById("loader")
const button = getById("submit")
const error = getById("error")
const success = getById("success")

const PASS_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

error.style.display = "none"
success.style.display = "none"
container.style.display = "none"

let token, userId

window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  })

  token = params.token
  userId = params.userId
  const res = await fetch(`/auth/verify-reset-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ token, userId }),
  })
  if (!res.ok) {
    const { error } = await res.json()
    loader.innerText = error
    return
  }
  loader.style.display = "none"
  container.style.display = "block"
})

const displayError = (err) => {
  success.style.display = "none"
  error.innerText = err
  error.style.display = "block"
}

const displaySuccess = (message) => {
  error.style.display = "none"
  success.innerText = message
  success.style.display = "block"
}

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!password.value.trim()) {
    return displayError("Password is required")
  }
  if (!PASS_REGEX.test(password.value)) {
    return displayError(
      "Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters"
    )
  }
  if (password.value !== confirmPassword.value) {
    return displayError("Passwords do not match")
  }

  button.disabled = true
  button.innerText = "Updating password..."

  const res = await fetch(`/auth/update-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ token, userId, password: password.value }),
  })

  if (!res.ok) {
    const { error } = await res.json()
    button.disabled = false;
    button.innerText = "Reset Password"
    return displayError(error)
  }

  displaySuccess("Your password has been updated successfully")

  password.value = ""
  confirmPassword.value = ""

  button.disabled = false
  button.innerText = "Reset password"
}

form.addEventListener("submit", handleSubmit)
