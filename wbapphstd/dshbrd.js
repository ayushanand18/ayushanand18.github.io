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

// Get User Details
	function getUserData(user){
		var name, email, photoUrl, uid, emailVerified;
		  name = user.displayName;
		  email = user.email;
		  photoUrl = user.photoURL;
		  emailVerified = user.emailVerified;
		  uid = user.uid;
		 $(".emlfld").html(uid + "<br/>" + email);
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


//var user = firebase.auth().currentUser;





// Add Page Load Animation
$(document).ready(function (){
	$(".lgn-div").hide();
	$(".ldng").show().delay(1500).fadeOut(500);
	$(".pswrd-spn").hide();
	$(".sgnup-div").hide();
	
	$(".lgn-div").delay(500).hide().delay(2000).fadeIn( function(){
		$("body").css("background-color","rgb(255,51,102)");
	});

	$(".btn-sgnin").click(function(){
		firebase.auth().signOut().then(function() {
			  // Sign-out successful.
			window.location.href="index.html";
		}).catch(function(error) {
			  alert(error);
		});
	});

});