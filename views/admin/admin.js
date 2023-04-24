"use strict";
/*
관리자페이지
아이디 : admin
비밀번호 : 1234
*/

const loginBox = document.querySelector(".form_box .login");
const passwordBox = document.querySelector(".form_box .password");

const login = document.getElementById("admin_login");
const password = document.getElementById("admin_password");

const submit = document.querySelector(".btn_box .btn_login");

function submitHandler(e) {
    e.preventDefault();

    const loginV = login.value;
    const passwordV = password.value;

    if (loginV.length === 0 || loginV !== "admin") {
        loginBox.classList.add("warning");
        login.focus();
    } else {
        loginBox.classList.remove("warning");
        loginBox.classList.add("check");
    }

    if (passwordV.length === 0 || passwordV !== "1234") {
        passwordBox.classList.add("warning");
        password.focus();
    } else {
        passwordBox.classList.remove("warning");
        passwordBox.classList.add("check");
    }

    if (
        (loginV.length === 0 || loginV !== "admin") &&
        (passwordV.length === 0 || passwordV !== "1234")
    ) {
        login.focus();
    }

    if (loginV === "admin" && passwordV === "1234") {
        window.location.href = "./goods.html";
    }
}

submit.addEventListener("click", submitHandler);
