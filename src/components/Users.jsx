import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

function Users() {
  const [usersData, setUsersData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const token = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [Id, setId] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/admins/store`,
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      },
      headers: { Authorization: `Bearer ${token.token}` },
    });
    setEmail("");
    setPassword("");
    setUsersData(response.data);
  };

  const onSubmitEdit = async (data) => {
    const response = await axios({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/admins/edit/ `,
      data: {
        Id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      },
      headers: { Authorization: `Bearer ${token.token}` },
    });

    setRefresh(!refresh);
  };

  function cleanInputs() {
    setValue("firstname", "");
    setValue("lastname", "");
    setValue("email", "");
    setValue("password", "");
  }

  useEffect(() => {
    async function getUsers() {
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_API_URL}/admins`,
      });

      setUsersData(response.data);
    }

    getUsers();
  }, [refresh]);

  async function getAdmin(adminId) {
    const response = await axios({
      method: "GET",
      url: `${import.meta.env.VITE_API_URL}/admins/show/${adminId}`,
      headers: { Authorization: `Bearer ${token.token}` },
    });

    const { id, firstname, lastname, email, password } = response.data;
    setId(id);
    setValue("firstname", firstname);
    setValue("lastname", lastname);
    setValue("email", email);
  }

  async function handleDestroy(adminId, adminEmail) {
    if (adminEmail === "admin@a.com") {
      return toast.error("El administrador por defecto no puede eliminarse.");
    }

    const response = await axios({
      method: "DELETE",
      url: `${import.meta.env.VITE_API_URL}/admins/destroy/${adminId}`,
      headers: { Authorization: `Bearer ${token.token}` },
    });
    setUsersData(response.data);
  }

  return (
    <>
      <div className="container container-users h-100">
        <div className="d-flex">
          <h1 className="mt-3 mb-3">Usuarios</h1>

          <Button
            className="ms-auto "
            variant=""
            onClick={() => {
              handleShow();
              cleanInputs();
            }}
          >
            <i class="bi bi-plus-circle fs-2 add-btn"></i>
          </Button>
        </div>

        <table className="table table-striped table-bordered ">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr key={user.id}>
                <th className="fw-normal">{user.id}</th>
                <th className="fw-normal">{user.firstname}</th>
                <th className="fw-normal">{user.lastname}</th>
                <th className="fw-normal">{user.email}</th>

                <th>
                  <Button
                    className="btn "
                    variant=""
                    onClick={() => {
                      setShow2(true);
                      getAdmin(user.id);
                    }}
                  >
                    <i class="bi bi-pencil-square text-primary bg-transparent"></i>
                  </Button>

                  <button
                    onClick={() => handleDestroy(user.id, user.email)}
                    className=" ms-1 btn "
                  >
                    <i className="bi bi-trash text-danger bg-transparent"></i>
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal show={show} handleClose={handleClose} handleShow={handleShow} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="firstname">Nombre</label>
            <input
              className="form-control"
              type="text"
              name="firstname"
              id="firstname"
              {...register("firstname")}
            />

            <label htmlFor="lastname" className="mt-2">
              Apellido
            </label>
            <input
              className="form-control"
              type="text"
              name="lastname"
              id="lastname"
              {...register("lastname")}
            />

            <label htmlFor="email" className="mt-2">
              Correo
            </label>
            <input
              className="form-control"
              type="email"
              name="email"
              id="email"
              {...register("email")}
              required
            />
            <label htmlFor="password" className="mt-2">
              Contraseña
            </label>
            <input
              className="form-control"
              type="password"
              name="password"
              id="password"
              {...register("password")}
              required
            />

            <button className="btn btn-success mt-4 w-100">Crear</button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Editar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form action="" onSubmit={handleSubmit(onSubmitEdit)}>
            <label htmlFor="firstname">Nombre</label>
            <input
              className="form-control"
              type="text"
              name="firstname"
              id="firstname"
              {...register("firstname")}
            />

            <label htmlFor="lastname">Apellido</label>
            <input
              className="form-control"
              type="text"
              name="lastname"
              id="lastname"
              {...register("lastname")}
            />

            <label htmlFor="email">Correo</label>
            <input
              className="form-control"
              type="email"
              name="email"
              id="email"
              {...register("email")}
            />
            <label htmlFor="password">Contraseña</label>
            <input
              className="form-control"
              type="password"
              name="password"
              id="password"
              {...register("password")}
            />

            <button className="mt-4 w-100 btn btn-success">
              Guardar cambios
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Users;
