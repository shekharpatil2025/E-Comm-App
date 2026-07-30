package com.shekhar.SpringBoot_ecom.service;

import com.shekhar.SpringBoot_ecom.model.Product;
import com.shekhar.SpringBoot_ecom.repo.ProductRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // tells JUnit to use Mockito
@DisplayName("ProductService Unit Tests")
class ProductServiceTest {

    @Mock
    private ProductRepo repo;// fake repo — no real DB

    @InjectMocks
    private ProductService productService;// real service with fake repo injected

    private Product product;

    @BeforeEach
    void setUp() {
        // Build a sample product used across multiple tests
        product = new Product();
        product.setId(1);
        product.setName("MacBook Pro");
        product.setBrand("Apple");
        product.setPrice(new BigDecimal("129999.00"));
        product.setCategory("Laptop");
        product.setProductAvailable(true);
        product.setStockQuantity(10);
    }

    // ── getAllProducts ────────────────────────────────────────────────

    @Test
    @DisplayName("getAllProducts - should return only available products")
    void getAllProducts_shouldReturnAvailableProducts() {
        // ARRANGE — define what the fake repo returns
        when(repo.findByProductAvailableTrue()).thenReturn(List.of(product));

        // ACT — call the real method
        List<Product> result = productService.getAllProducts();

        // ASSERT — verify the result
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("MacBook Pro");

        // verify repo was called exactly once
        verify(repo, times(1)).findByProductAvailableTrue();
    }

    @Test
    @DisplayName("getAllProducts - should return empty list when no products available")
    void getAllProducts_shouldReturnEmptyList_whenNoProductsAvailable() {
        when(repo.findByProductAvailableTrue()).thenReturn(List.of());

        List<Product> result = productService.getAllProducts();

        assertThat(result).isEmpty();
        verify(repo, times(1)).findByProductAvailableTrue();
    }

    // ── getProductById ────────────────────────────────────────────────

    @Test
    @DisplayName("getProductById - should return product when ID exists")
    void getProductById_shouldReturnProduct_whenIdExists() {
        when(repo.findById(1)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1);
        assertThat(result.getName()).isEqualTo("MacBook Pro");
        verify(repo, times(1)).findById(1);
    }

    @Test
    @DisplayName("getProductById - should throw exception when ID not found")
    void getProductById_shouldThrowException_whenIdNotFound() {
        when(repo.findById(99)).thenReturn(Optional.empty());

        // Optional.get() on empty throws NoSuchElementException
        assertThatThrownBy(() -> productService.getProductById(99))
                .isInstanceOf(Exception.class);

        verify(repo, times(1)).findById(99);
    }

    // ── addOrUpdateProduct ────────────────────────────────────────────

    @Test
    @DisplayName("addOrUpdateProduct - should save product with image when image provided")
    void addOrUpdateProduct_shouldSaveWithImage_whenImageProvided() throws IOException {
        // Arrange — mock MultipartFile
        MultipartFile mockImage = mock(MultipartFile.class);
        when(mockImage.isEmpty()).thenReturn(false);
        when(mockImage.getOriginalFilename()).thenReturn("macbook.jpg");
        when(mockImage.getContentType()).thenReturn("image/jpeg");
        when(mockImage.getBytes()).thenReturn(new byte[]{1, 2, 3});
        when(repo.save(any(Product.class))).thenReturn(product);

        // Act
        Product result = productService.addOrUpdateProduct(product, mockImage);

        // Assert — image fields were set on product before saving
        assertThat(product.getImageName()).isEqualTo("macbook.jpg");
        assertThat(product.getImageType()).isEqualTo("image/jpeg");
        assertThat(product.getImageData()).isEqualTo(new byte[]{1, 2, 3});
        assertThat(result).isNotNull();
        verify(repo, times(1)).save(product);
    }

    @Test
    @DisplayName("addOrUpdateProduct - should save product without updating image when image is null")
    void addOrUpdateProduct_shouldSaveProduct_whenImageIsNull() throws IOException {
        when(repo.save(any(Product.class))).thenReturn(product);

        Product result = productService.addOrUpdateProduct(product, null);

        // Image fields should remain untouched
        assertThat(result).isNotNull();
        verify(repo, times(1)).save(product);
        // verify image bytes were never read
    }

    @Test
    @DisplayName("addOrUpdateProduct - should save product without updating image when image is empty")
    void addOrUpdateProduct_shouldSaveProduct_whenImageIsEmpty() throws IOException {
        MultipartFile emptyImage = mock(MultipartFile.class);
        when(emptyImage.isEmpty()).thenReturn(true);
        when(repo.save(any(Product.class))).thenReturn(product);

        Product result = productService.addOrUpdateProduct(product, emptyImage);

        assertThat(result).isNotNull();
        verify(repo, times(1)).save(product);
        // getBytes should never be called on an empty image
        verify(emptyImage, never()).getBytes();
    }

    // ── deleteProduct (soft delete) ───────────────────────────────────

    @Test
    @DisplayName("deleteProduct - should soft delete by marking unavailable and zeroing stock")
    void deleteProduct_shouldSoftDelete_markingProductUnavailable() {
        when(repo.findById(1)).thenReturn(Optional.of(product));
        when(repo.save(any(Product.class))).thenReturn(product);

        productService.deleteProduct(1);

        // Core assertion — soft delete sets these two fields
        assertThat(product.getProductAvailable()).isFalse();
        assertThat(product.getStockQuantity()).isEqualTo(0);

        // Product must be saved (not deleted) after soft delete
        verify(repo, times(1)).save(product);
        verify(repo, never()).deleteById(any());
    }

    @Test
    @DisplayName("deleteProduct - should throw RuntimeException when product not found")
    void deleteProduct_shouldThrowException_whenProductNotFound() {
        when(repo.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.deleteProduct(99))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Product not found with id: 99");

        // repo.save should never be called if product doesn't exist
        verify(repo, never()).save(any());
    }

    // ── SearchProduct ─────────────────────────────────────────────────

    @Test
    @DisplayName("searchProduct - should return matching products for keyword")
    void searchProduct_shouldReturnMatchingProducts() {
        when(repo.SearchProduct("mac")).thenReturn(List.of(product));

        List<Product> result = productService.SearchProduct("mac");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("MacBook Pro");
        verify(repo, times(1)).SearchProduct("mac");
    }

    @Test
    @DisplayName("searchProduct - should return empty list when no products match keyword")
    void searchProduct_shouldReturnEmptyList_whenNoMatch() {
        when(repo.SearchProduct("xyz123")).thenReturn(List.of());

        List<Product> result = productService.SearchProduct("xyz123");

        assertThat(result).isEmpty();
        verify(repo, times(1)).SearchProduct("xyz123");
    }
}