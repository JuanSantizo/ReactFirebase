import React, { Fragment, useCallback, useState } from "react";
import { withRouter } from "react-router-dom";
import { auth } from "./firebase";

const Reset = (props) => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState(null);

	const procesarDatos = (e) => {
		e.preventDefault();
		if (!email.trim()) {
			setError("Ingrese Email");
			return;
		}

		setError(null);

		recuperar();
	};

	const recuperar = useCallback(async () => {
		try {
			await auth.sendPasswordResetEmail(email);
			console.log("Correo Enviado");

			props.history.push("/login");
		} catch (error) {
			console.log(error);
			setError(error.message);
		}
	}, [email, props.history]);

	return (
		<Fragment>
			<div className="mt-5">
				<h3 className="text-center">Reiniciar Contraseña</h3>
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

							<button className="btn btn-dark btn-lg col-12 mb-2" type="submit">
								Reiniciar Contraseña
							</button>
						</form>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withRouter(Reset);
