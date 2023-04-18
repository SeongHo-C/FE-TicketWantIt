import axios from "axios";

const [
  email,
  nameInput,
  password,
  confirmPassword,
] = document.querySelectorAll(".inputText");

const logo = document.querySelector("#logo");
const signUpButton = document.querySelector("#signup_btn");

const signUpFunction = (e) => {
  e.preventDefault();

  //email 형식으로 바꾸기
  if (email.value.length < 3) {
    alert("ID를 2글자 이상 입력해주세요.");
  }
  else if (nameInput.value.length < 3) {
    alert("이름을 2글자 이상 입력해주세요.");
  }
  else if (password.value.length < 7) {
    alert("비밀번호를 6글자 이상 입력해주세요.");
  }
  else if (confirmPassword.value !== password.value) {
    alert("비밀번호가 다릅니다. 비밀번호를 확인해주세요.");
  }

  axios.post("회원가입 API", {
    headers: {
      "Content-type" : "application/json"
    },
    data: {
      email : email.value,
      name : nameInput.value,
      password : password.value,
    }
  })
  //then 부분 async await으로 찾아보기
  .then((res) => {
    if (res.status === 200) {
      if (confirm("회원가입 하시겠습니까?")) {
        alert("회원가입이 완료되었습니다!");
        window.location.href = 'login.html';
      } else {
          alert("회원가입에 실패했습니다.");
          return;
      }
    } else {
        alert("회원가입에 실패했습니다.");
        return;
    }
  })
}

signUpButton.addEventListener("click", signUpFunction);

logo.addEventListener("click", () => {
  window.location.href = "login.html"
})