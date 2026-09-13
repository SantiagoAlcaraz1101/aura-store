import test from "node:test";
import assert from "node:assert/strict";
import { products, brands, categories } from "../js/data.js";
import {
  filterProducts,
  normalizeBag,
  changeBag,
  bagTotal,
  stockFor,
  validateRequest,
} from "../js/store.js";

const validRequest = {
  name: "Cliente Demo",
  email: "demo@example.com",
  city: "Bogotá",
  productId: "dunk-panda",
  size: "40",
  message: "Busco este par para usarlo con jeans a diario.",
  consent: true,
};

test("cada producto tiene IDs relacionados, precio entero y tallas únicas con stock no negativo", () => {
  assert.equal(
    new Set(products.map((product) => product.id)).size,
    products.length,
  );
  for (const product of products) {
    assert.ok(brands.some((brand) => brand.id === product.brandId));
    assert.ok(
      categories.some((category) => category.id === product.categoryId),
    );
    assert.ok(Number.isInteger(product.price) && product.price > 0);
    assert.equal(
      new Set(product.sizes.map((item) => item.size)).size,
      product.sizes.length,
    );
    assert.ok(
      product.sizes.every(
        (item) => Number.isInteger(item.stock) && item.stock >= 0,
      ),
    );
  }
});

test("combina marca, categoría y búsqueda sin mutar el catálogo", () => {
  const original = products.map((product) => product.id);
  assert.deepEqual(
    filterProducts(products, brands, {
      brand: "nike",
      category: "court",
      search: "PÁNDA",
    }).map((product) => product.id),
    ["dunk-panda"],
  );
  const sorted = filterProducts(products, brands, { sort: "price-asc" });
  assert.equal(sorted[0].id, "air-force");
  assert.equal(sorted.at(-1).id, "jordan-green");
  assert.deepEqual(
    products.map((product) => product.id),
    original,
  );
});

test("una combinación incompatible y una búsqueda inexistente devuelven cero resultados", () => {
  assert.deepEqual(
    filterProducts(products, brands, { brand: "nike", category: "retro" }),
    [],
  );
  assert.deepEqual(
    filterProducts(products, brands, { search: "modelo-inexistente" }),
    [],
  );
});

test("la bolsa rechaza falta de talla, talla agotada y producto inexistente", () => {
  for (const [id, size] of [
    ["dunk-panda", null],
    ["dunk-panda", 41],
    ["falso", 40],
  ]) {
    const result = changeBag([], products, id, size, 1);
    assert.ok(result.error);
    assert.deepEqual(result.bag, []);
  }
});

test("agrupa mismo producto y talla pero mantiene tallas diferentes", () => {
  let bag = changeBag([], products, "dunk-panda", 40, 1).bag;
  bag = changeBag(bag, products, "dunk-panda", 40, 1).bag;
  bag = changeBag(bag, products, "dunk-panda", 39, 1).bag;
  assert.equal(bag.length, 2);
  assert.equal(bag.find((item) => item.size === 40).quantity, 2);
  assert.equal(bagTotal(bag, products), 649900 * 3);
  const updated = changeBag(bag, products, "dunk-panda", 40, 1).bag;
  assert.deepEqual(
    updated.map((item) => item.size),
    [40, 39],
  );
});

test("no excede stock al añadir o incrementar y elimina al llegar a cero", () => {
  const first = changeBag([], products, "dunk-panda", 43, 1).bag;
  assert.equal(stockFor(products, "dunk-panda", 43), 1);
  const over = changeBag(first, products, "dunk-panda", 43, 1);
  assert.ok(over.error);
  assert.deepEqual(over.bag, first);
  assert.deepEqual(changeBag(first, products, "dunk-panda", 43, -1).bag, []);
});

test("recupera almacenamiento corrupto, obsoleto, duplicado y cantidades excesivas", () => {
  assert.deepEqual(normalizeBag({ invalid: true }, products), []);
  const clean = normalizeBag(
    [
      null,
      { productId: "falso", size: 40, quantity: 2 },
      { productId: "dunk-panda", size: 41, quantity: 1 },
      { productId: "dunk-panda", size: 40, quantity: -2 },
      { productId: "dunk-panda", size: 40, quantity: 1.5 },
      { productId: "dunk-panda", size: 40, quantity: 2 },
      { productId: "dunk-panda", size: "40", quantity: 999, price: 1 },
    ],
    products,
  );
  assert.deepEqual(clean, [{ productId: "dunk-panda", size: 40, quantity: 4 }]);
  assert.equal(bagTotal(clean, products), 649900 * 4);
});

test("formulario vacío produce errores en todos los campos", () => {
  assert.deepEqual(Object.keys(validateRequest({}, products)).sort(), [
    "city",
    "consent",
    "email",
    "message",
    "name",
    "productId",
    "size",
  ]);
});

test("rechaza email inválido, texto corto, espacios y consentimiento ausente", () => {
  const errors = validateRequest(
    {
      ...validRequest,
      name: "  ",
      city: " A ",
      email: "a@@correo.com",
      message: "corto",
      consent: false,
    },
    products,
  );
  assert.deepEqual(Object.keys(errors).sort(), [
    "city",
    "consent",
    "email",
    "message",
    "name",
  ]);
});

test("rechaza un producto ajeno al catálogo y una talla que no le corresponde", () => {
  assert.ok(
    validateRequest({ ...validRequest, productId: "inventado" }, products)
      .productId,
  );
  assert.ok(validateRequest({ ...validRequest, size: "41" }, products).size);
  assert.ok(validateRequest({ ...validRequest, size: "99" }, products).size);
});

test("longitudes máximas y mínimas se verifican incluso fuera del HTML", () => {
  const errors = validateRequest(
    { ...validRequest, name: "a".repeat(81), message: "x".repeat(601) },
    products,
  );
  assert.ok(errors.name);
  assert.ok(errors.message);
  assert.deepEqual(
    validateRequest(
      { ...validRequest, name: "Ana", message: "a".repeat(20) },
      products,
    ),
    {},
  );
});

test("una solicitud completa, válida y con talla disponible se acepta", () => {
  assert.deepEqual(validateRequest(validRequest, products), {});
});
