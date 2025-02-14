-- CreateTable
CREATE TABLE `banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `imagen` VARCHAR(191) NULL,
    `padre_id` INTEGER NULL,

    UNIQUE INDEX `Categoria_slug_key`(`slug`),
    INDEX `Categoria_padre_id_idx`(`padre_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idmarca` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `imagen` VARCHAR(191) NULL,

    UNIQUE INDEX `marca_idmarca_key`(`idmarca`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `color` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `codigo_hex` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Color_nombre_key`(`nombre`),
    UNIQUE INDEX `Color_codigo_hex_key`(`codigo_hex`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imagenproducto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_producto` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `alt_text` VARCHAR(191) NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `es_principal` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `imagenproducto_id_producto_key`(`id_producto`),
    INDEX `ImagenProducto_id_producto_erp_idx`(`id_producto`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedido` (
    `id` VARCHAR(191) NOT NULL,
    `id_pedido_erp` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `fecha_pedido` DATETIME(3) NOT NULL,
    `metadatos_adicionales` LONGTEXT NULL,

    UNIQUE INDEX `Pedido_id_pedido_erp_key`(`id_pedido_erp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idproducto` VARCHAR(191) NOT NULL,
    `nombreproducto` VARCHAR(191) NOT NULL,
    `lista1` DECIMAL(10, 2) NULL,
    `lista2` DECIMAL(10, 2) NULL,
    `porciva` DECIMAL(5, 2) NULL,
    `ivaincluido` CHAR(1) NULL,
    `descripcionLarga` TEXT NULL,
    `descripcionCorta` TEXT NULL,
    `slug` VARCHAR(191) NULL,
    `destacado` BOOLEAN NOT NULL DEFAULT false,
    `cantidad` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `producto_idproducto_key`(`idproducto`),
    UNIQUE INDEX `producto_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productocategoria` (
    `id_producto` INTEGER NOT NULL,
    `id_categoria` INTEGER NOT NULL,

    INDEX `ProductoCategoria_id_categoria_idx`(`id_categoria`),
    INDEX `ProductoCategoria_id_producto_erp_idx`(`id_producto`),
    PRIMARY KEY (`id_producto`, `id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productomarca` (
    `id_producto` INTEGER NOT NULL,
    `id_marca` INTEGER NOT NULL,

    INDEX `ProductoMarca_id_marca_idx`(`id_marca`),
    INDEX `ProductoMarca_id_producto_erp_idx`(`id_producto`),
    PRIMARY KEY (`id_producto`, `id_marca`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productocolor` (
    `id_producto` INTEGER NOT NULL,
    `id_color` INTEGER NOT NULL,

    INDEX `ProductoColor_id_color_idx`(`id_color`),
    INDEX `ProductoColor_id_producto_erp_idx`(`id_producto`),
    PRIMARY KEY (`id_producto`, `id_color`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_producto` INTEGER NOT NULL,
    `nombre_cliente` VARCHAR(191) NOT NULL,
    `calificacion` INTEGER NOT NULL,
    `comentario` TEXT NULL,
    `fecha_review` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `aprobado` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Review_id_producto_erp_idx`(`id_producto`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `primerNombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `direccionId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_correo_key`(`correo`),
    UNIQUE INDEX `Usuario_direccionId_key`(`direccionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Direccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `calle` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `pais` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
