import React, { Fragment, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { auth } from "../firebase";
import Firestore from "./Firestore";

const Admin = (props) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (auth.currentUser) {
			console.log("Existe usuario");
			setUser(auth.currentUser);
		} else {
			console.log("No Existe usuario");
			props.history.push("/login");
		}
	}, [props.history]);

	return (
		<Fragment>
			<h1>Ruta Protegida</h1>
			{user && <Firestore user={user} />}
		</Fragment>
	);
};

export default withRouter(Admin);
