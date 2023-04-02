
const auth = firebase.auth();
const signInWithGoogleButton = document.getElementById('signInWithGoogle');
const logoutButton = document.getElementById('logout');
const loginCard = document.getElementById('login-card');
const welcomeCard = document.getElementById('welcome-user');
const userNameHtml = document.getElementById('user-name');

const signInWithGoogle = (e) => {
    e.preventDefault();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(googleProvider).then((result) => {}).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        // ...

        console.log(errorCode, errorMessage)
    });
}

const userSignOut = (e) => {
    auth.signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        // ...

        console.log(errorCode, errorMessage)
    });
}


(function () {

    console.log('iNIT THE APP')

    signInWithGoogleButton.addEventListener("click", signInWithGoogle)
    logoutButton.addEventListener("click", userSignOut)

    auth.onAuthStateChanged((user) => {
        console.log(user);
        if (user == null) {
            welcomeCard.style.display = 'none';
            loginCard.style.display = 'block';
        } else {
            welcomeCard.style.display = 'block';
            loginCard.style.display = 'none';

            userNameHtml.innerText = user.displayName;
        }
    });

})();