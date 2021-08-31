import React, { useEffect, useState } from "react";
import { db } from "../firebase";

function Firestore(props) {
	const [tareas, setTareas] = useState([]);
	const [tarea, setTarea] = useState("");
	const [modoEdicion, setModoEdicion] = useState(false);
	const [id, setId] = useState("");

	useEffect(() => {
		const obtenerDatos = async () => {
			try {
				const data = await db.collection(props.user.uid).get();

				const arrayData = data.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setTareas(arrayData);
			} catch (error) {
				console.log(error);
			}
		};
		obtenerDatos();
	}, []);

	const agregar = async (e) => {
		e.preventDefault();

		if (!tarea.trim()) {
			console.log("Esta vacio");
			return;
		}

		try {
			const nuevaTarea = {
				name: tarea,
				fecha: Date.now(),
			};

			const data = await db.collection(props.user.uid).add(nuevaTarea);

			setTareas([...tareas, { ...nuevaTarea, id: data.id }]);
			setTarea("");
		} catch (error) {
			console.log(error);
		}
		console.log(tarea);
	};

	const eliminar = async (id) => {
		try {
			await db.collection("tareas").doc(id).delete();

			const arrayFiltrado = tareas.filter((item) => item.id !== id);
			setTareas(arrayFiltrado);
		} catch (error) {
			console.log(error);
		}
	};

	const activarEdicion = (item) => {
		setModoEdicion(true);
		setTarea(item.name);
		setId(item.id);
	};

	const editar = async (e) => {
		e.preventDefault();

		if (!tarea.trim()) {
			console.log("Esta vacio");
			return;
		}

		try {
			await db.collection(props.user.uid).doc(id).update({ name: tarea });

			const arrayEditado = tareas.map((item) =>
				item.id === id ? { id: item.id, fecha: item.fecha, name: tarea } : item
			);

			setTareas(arrayEditado);

			setModoEdicion(false);
			setTarea("");
			setId("");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="container mt-3">
			<div className="row">
				<div className="col-md-6">
					<ul className="list-group">
						{tareas.map((item) => (
							<li className="list-group-item" key={item.id}>
								{item.name}
								<button
									className="btn btn-danger btn-sm float-end"
									onClick={() => eliminar(item.id)}
								>
									Eliminar
								</button>

								<button
									className="btn btn-warning btn-sm float-end mx-2"
									onClick={() => activarEdicion(item)}
								>
									Editar
								</button>
							</li>
						))}
					</ul>
				</div>

				<div className="col-md-6">
					<h3>{modoEdicion ? "Editar Tarea" : "Agregar Tarea"}</h3>
					<form onSubmit={modoEdicion ? editar : agregar}>
						<input
							type="text"
							placeholder="Ingrese Tarea"
							className="form-control mb-2"
							onChange={(e) => setTarea(e.target.value)}
							value={tarea}
						/>
						<button
							className={
								modoEdicion ? "btn btn-warning col-12" : "btn btn-dark col-12"
							}
							type="submit"
						>
							{modoEdicion ? "Editar" : "Agregar"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Firestore;
