import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBWRbc_V2cMWIV1D4u-ut-hSNPJGaurBi4",
	authDomain: "crud-udemy-react-587a3.firebaseapp.com",
	projectId: "crud-udemy-react-587a3",
	storageBucket: "crud-udemy-react-587a3.appspot.com",
	messagingSenderId: "466237577513",
	appId: "1:466237577513:web:5f7cbacbcd53703583ff38",
};

// Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = app.auth();

export { db, auth };
