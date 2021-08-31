import React, { Fragment, useCallback, useState } from "react";
import { withRouter } from "react-router-dom";
import { auth, db } from "../firebase";

const Login = (props) => {
	const [email, setEmail] = useState("prueba@prueba.com");
	const [pass, setPass] = useState("1234567890");
	const [error, setError] = useState(null);
	const [esRegistro, setEsRegistro] = useState(false);

	const procesarDatos = (e) => {
		e.preventDefault();
		if (!email.trim()) {
			setError("Ingrese Email");
			return;
		}
		if (!pass.trim()) {
			setError("Ingrese Password");
			return;
		}
		if (pass.trim().length < 6) {
			setError("El password debe ser mayor a 6 caracteres");
			return;
		}

		setError(null);
		console.log("Pasando todas las validaciones");

		if (esRegistro) {
			registrar();
		} else {
			login();
		}
	};

	const login = useCallback(async () => {
		try {
			const res = await auth.signInWithEmailAndPassword(email, pass);
			console.log(res.user);

			setEmail("");
			setPass("");
			setError("");

			props.history.push("/admin");
		} catch (error) {
			console.log(error);

			if (error.code === "auth/user-not-found") {
				setError("El usuario no fue encontrado");
			}

			if (error.code === "auth/wrong-password") {
				setError("La contraseña no es valida");
			}
		}
	}, [email, pass, props.history]);

	const registrar = useCallback(async () => {
		try {
			const res = await auth.createUserWithEmailAndPassword(email, pass);
			await db
				.collection("usuarios")
				.doc(res.user.email)
				.set({ email: res.user.email, uid: res.user.uid });

			await db
				.collection(res.user.uid)
				.add({ name: "Tarea de Ejemplo", fecha: Date.now() });
			setEmail("");
			setPass("");
			setError("");

			props.history.push("/admin");
		} catch (error) {
			console.log(error);
			if (error.code === "auth/invalid-email") {
				setError("Email no valido");
			}
			if (error.code === "auth/email-already-in-use") {
				setError("El usuario ya esta registrado");
			}
		}
	}, [email, pass, props.history]);

	return (
		<Fragment>
			<div className="mt-5">
				<h3 className="text-center">
					{esRegistro ? "Registro de Usuarios" : "Login de Acceso"}
				</h3>
				<hr />
				<div className="row justify-content-center">
					<div className="col-12 col-sm-8 col-md-l col-xl-4">
						<form onSubmit={procesarDatos}>
							{error && <div className="alert alert-danger">{error}</div>}
							<input
								type="email"
								className="form-control mb-2"
								placeholder="Ingrese un email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<input
								type="password"
								className="form-control mb-2"
								placeholder="Ingrese un password"
								value={pass}
								onChange={(e) => setPass(e.target.value)}
							/>
							<button className="btn btn-dark btn-lg col-12 mb-2" type="submit">
								{esRegistro ? "Registrar" : "Acceder"}
							</button>

							<button
								className="btn btn-info btn-sm col-12"
								type="button"
								onClick={() => setEsRegistro(!esRegistro)}
							>
								{esRegistro ? "Ya estas registrado?" : "No tienes Cuenta?"}
							</button>
							{!esRegistro ? (
								<button
									className="btn btn-danger btn-lg btn-sm mt-2"
									type="button"
									onClick={() => props.history.push("/reset")}
								>
									Recuperar Contraseña
								</button>
							) : null}
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withRouter(Login);
