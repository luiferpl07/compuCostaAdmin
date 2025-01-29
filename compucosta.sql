-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-01-2025 a las 20:39:11
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `compucosta`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `banner`
--

CREATE TABLE `banner` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `banner`
--

INSERT INTO `banner` (`id`, `title`, `imageUrl`, `isActive`, `createdAt`) VALUES
(1, 'PC Gamers', 'https://d598hd2wips7r.cloudfront.net/magefan_blog/Omnitrix_Cyprus_Lago_Phuket_Delice_Env.jpg', 1, '2025-01-24 15:30:01.764');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `slug` varchar(191) NOT NULL,
  `imagen` varchar(191) DEFAULT NULL,
  `padre_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `nombre`, `descripcion`, `slug`, `imagen`, `padre_id`) VALUES
(2, 'Computadores', 'Laptops\nPCs de escritorio', 'Computadores', 'https://www.claroshop.com/c/algolia/assets/portada/pc.webp', NULL),
(3, 'Monitores', '', 'Monitores', 'https://monitores.com.co/wp-content/uploads/2023/10/Monitor-Lenovo-ThinkVision-C27-40-de-27-Inicio-II-monitores.com_.co_.jpg', NULL),
(4, 'Redes y Conectividad', 'Routers y módems\nSwitches\nAntenas Wi-Fi\nAdaptadores de red', 'Redes y Conectividad', 'https://i.blogs.es/975bca/punto-de-acceso/650_1200.webp', NULL),
(5, 'Impresoras y Escáneres', 'Impresoras láser y de tinta\nEscáneres\nConsumibles (tinta, papel)', 'Impresoras y Escáneres', 'https://www.altasenal.com/wp-content/uploads/2024/12/15204.jpg', NULL),
(6, 'Almacenamiento', '', 'Almacenamiento', 'https://www.impresistem.com/7097-large_default/asu650ss-512gt-r.jpg', NULL),
(7, 'Accesorios', 'Teclados y Mouse\nWebcams', 'Accesorios', 'https://www.radioshackla.com/media/catalog/product/g/a/galaxy2604774_shdp59ybrhbdbcgz.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `color`
--

CREATE TABLE `color` (
  `id` int(11) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `codigo_hex` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `color`
--

INSERT INTO `color` (`id`, `nombre`, `codigo_hex`) VALUES
(1, 'blanco', '#fff'),
(2, 'Negro', '#000000'),
(3, 'azul', '#32bde8');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion`
--

CREATE TABLE `direccion` (
  `id` int(11) NOT NULL,
  `calle` varchar(191) NOT NULL,
  `ciudad` varchar(191) NOT NULL,
  `pais` varchar(191) NOT NULL,
  `usuarioId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenproducto`
--

CREATE TABLE `imagenproducto` (
  `id` int(11) NOT NULL,
  `id_producto` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `alt_text` varchar(191) DEFAULT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `es_principal` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `imagenproducto`
--

INSERT INTO `imagenproducto` (`id`, `id_producto`, `url`, `alt_text`, `orden`, `es_principal`, `created_at`) VALUES
(6, '322323', '/uploads/322323/1738030630977-placa-base.jpg', 'placa base', 0, 1, '2025-01-28 02:17:11.008'),
(7, '12314', '/uploads/12314/1738165429651-mouse.jpg', 'mouse', 0, 1, '2025-01-29 15:43:49.862');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id` int(11) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `imagen` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id`, `nombre`, `imagen`) VALUES
(2, 'HP', 'https://compulago.b-cdn.net/wp-content/uploads/2024/12/7.-NCCM-HP.png'),
(3, 'Dell', 'https://compulago.b-cdn.net/wp-content/uploads/2024/12/8.-NCCM-DELL.png'),
(4, 'Acer', 'https://compulago.b-cdn.net/wp-content/uploads/2024/12/9.-NCCM-ACER.png'),
(5, 'Asus', 'https://compulago.b-cdn.net/wp-content/uploads/2024/12/10.-NCCM-ASUS.png'),
(6, 'Kingston', 'https://compulago.b-cdn.net/wp-content/uploads/2024/12/12.-NCCM-KINGSTON.png'),
(7, 'Razer', 'https://compulago.b-cdn.net/wp-content/uploads/2024/12/5.-NCCM-Razer.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id` varchar(191) NOT NULL,
  `id_pedido_erp` varchar(191) NOT NULL,
  `estado` varchar(191) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha_pedido` datetime(3) NOT NULL,
  `metadatos_adicionales` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` varchar(191) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `descripcionLarga` text DEFAULT NULL,
  `descripcionCorta` text DEFAULT NULL,
  `slug` varchar(191) NOT NULL,
  `destacado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `enStock` tinyint(1) NOT NULL DEFAULT 1,
  `esNuevo` tinyint(1) NOT NULL DEFAULT 0,
  `precioDescuento` decimal(10,2) DEFAULT NULL,
  `puntuacionPromedio` double DEFAULT 0,
  `reseñasCount` int(11) NOT NULL DEFAULT 0,
  `vistaGeneral` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `precio`, `descripcionLarga`, `descripcionCorta`, `slug`, `destacado`, `created_at`, `updated_at`, `cantidad`, `enStock`, `esNuevo`, `precioDescuento`, `puntuacionPromedio`, `reseñasCount`, `vistaGeneral`) VALUES
('12314', 'mouse', 30000.00, 'asdasdasda', 'asdfasda', 'mouse', 0, '2025-01-29 15:43:49.862', '2025-01-29 15:43:49.857', 50, 1, 0, 29000.00, 0, 0, 'adsasdasdasd'),
('322323', 'placa base', 12121.00, 'asdasdasdasdasdasdsd', 'sadsd', 'placa-base', 0, '2025-01-28 02:17:11.008', '2025-01-28 02:17:11.005', 17, 1, 0, 10000.00, 0, 0, 'sdadasdasdas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productocategoria`
--

CREATE TABLE `productocategoria` (
  `id_producto` varchar(191) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productocategoria`
--

INSERT INTO `productocategoria` (`id_producto`, `id_categoria`) VALUES
('12314', 7),
('322323', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productocolor`
--

CREATE TABLE `productocolor` (
  `id_producto` varchar(191) NOT NULL,
  `id_color` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productocolor`
--

INSERT INTO `productocolor` (`id_producto`, `id_color`) VALUES
('12314', 1),
('12314', 2),
('12314', 3),
('322323', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productomarca`
--

CREATE TABLE `productomarca` (
  `id_producto` varchar(191) NOT NULL,
  `id_marca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productomarca`
--

INSERT INTO `productomarca` (`id_producto`, `id_marca`) VALUES
('12314', 2),
('322323', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `id_producto` varchar(191) NOT NULL,
  `nombre_cliente` varchar(191) NOT NULL,
  `calificacion` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `fecha_review` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `aprobado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` varchar(191) NOT NULL,
  `primerNombre` varchar(191) NOT NULL,
  `apellido` varchar(191) NOT NULL,
  `correo` varchar(191) NOT NULL,
  `direccionId` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Categoria_slug_key` (`slug`),
  ADD KEY `Categoria_padre_id_idx` (`padre_id`);

--
-- Indices de la tabla `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Color_nombre_key` (`nombre`),
  ADD UNIQUE KEY `Color_codigo_hex_key` (`codigo_hex`);

--
-- Indices de la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `imagenproducto`
--
ALTER TABLE `imagenproducto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ImagenProducto_id_producto_erp_idx` (`id_producto`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Pedido_id_pedido_erp_key` (`id_pedido_erp`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Producto_slug_key` (`slug`);

--
-- Indices de la tabla `productocategoria`
--
ALTER TABLE `productocategoria`
  ADD PRIMARY KEY (`id_producto`,`id_categoria`),
  ADD KEY `ProductoCategoria_id_categoria_idx` (`id_categoria`),
  ADD KEY `ProductoCategoria_id_producto_erp_idx` (`id_producto`);

--
-- Indices de la tabla `productocolor`
--
ALTER TABLE `productocolor`
  ADD PRIMARY KEY (`id_producto`,`id_color`),
  ADD KEY `ProductoColor_id_color_idx` (`id_color`),
  ADD KEY `ProductoColor_id_producto_erp_idx` (`id_producto`);

--
-- Indices de la tabla `productomarca`
--
ALTER TABLE `productomarca`
  ADD PRIMARY KEY (`id_producto`,`id_marca`),
  ADD KEY `ProductoMarca_id_marca_idx` (`id_marca`),
  ADD KEY `ProductoMarca_id_producto_erp_idx` (`id_producto`);

--
-- Indices de la tabla `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Review_id_producto_erp_idx` (`id_producto`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Usuario_correo_key` (`correo`),
  ADD UNIQUE KEY `Usuario_direccionId_key` (`direccionId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `color`
--
ALTER TABLE `color`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `direccion`
--
ALTER TABLE `direccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `imagenproducto`
--
ALTER TABLE `imagenproducto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
