
 // Initialize Firebase
	  var config = {
   	 apiKey: "AIzaSyCcrYfOrTxfnZzgTq17RNiTE95wMjMn8hY",
	    authDomain: "pwa-intru.firebaseapp.com",
	    databaseURL: "https://pwa-intru.firebaseio.com",
	    projectId: "pwa-intru",
	    storageBucket: "pwa-intru.appspot.com",
	    messagingSenderId: "696864317345"
	  };
	  firebase.initializeApp(config);
	const db = firebase.firestore();
		 db.settings({
		 timestampsInSnapshots: true
		 });

// Get User Details
	function getUserData(user){
		var name, email, photoUrl, uid, emailVerified;
		  name = user.displayName;
		  email = user.email;
		  photoUrl = user.photoURL;
		  emailVerified = user.emailVerified;
		  uid = user.uid;
		getUserDetails(user);
	}



// Authenticate Login
	function checkCookie() {
		firebase.auth().onAuthStateChanged(function(user) {
  		if (user) {
		    // User is signed in.
			getUserData(user);
			
		  } else {	
			window.location.href="login.html";
		  }
		});
	};

