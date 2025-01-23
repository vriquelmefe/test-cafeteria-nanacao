const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafés", () => {
  it("Debe la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto", async () => {
    const response = await request(server).get("/cafes");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(typeof response.body[0]).toBe("object");
  });

  it("Debe Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe.", async () => {
    const idNoExiste = 488;
    const response = await request(server)
      .delete(`/cafes/${idNoExiste}`)
      .set("Authorization", "Bearer token_valido");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(`No se encontró ningún cafe con ese id`);
  });

  it("Debe la ruta POST /cafes agrega un nuevo café y devuelve un código 201", async () => {
    const newCafe = { id: Math.floor(Math.random() * 1000), nombre: "Nuevo café exploción de energía" };
    const response = await request(server).post("/cafes").send(newCafe);

    expect(response.statusCode).toBe(201);
    expect(response.body).toContainEqual(newCafe);
  });

  it("Debe la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload.", async () => {
    const updateCoffe = { id: 1, nombre: "Capuccino Vainilla deslactosado" };
    const response = await request(server).put("/cafes/2").send(updateCoffe);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(`El id del parámetro (ID: ${updateCoffe} no coincide con el id del café recibido`);
  });
});
