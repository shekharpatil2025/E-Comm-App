package com.shekhar.SpringBoot_ecom.service;

import com.shekhar.SpringBoot_ecom.model.DTO.PageResponse;
import com.shekhar.SpringBoot_ecom.model.Product;
import com.shekhar.SpringBoot_ecom.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    // Existing — unchanged
    // Cache product list — served from Redis after first call
    @Cacheable(value = "products", unless = "#result.isEmpty()")
    public List<Product> getAllProducts() {
        return repo.findByProductAvailableTrue();
    }

    public Product getProductById(int id) {
        return repo.findById(id).get();
    }

    // Clear cache when product is added or updated
    @CacheEvict(value = "products", allEntries = true)
    public Product addOrUpdateProduct(Product product, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            product.setImageName(image.getOriginalFilename());
            product.setImageType(image.getContentType());
            product.setImageData(image.getBytes());
        }
        return repo.save(product);
    }

    // Clear cache when product is deleted
    @CacheEvict(value = "products", allEntries = true)
    public void deleteProduct(int id) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setProductAvailable(false);
        product.setStockQuantity(0);
        repo.save(product);
    }

    public List<Product> SearchProduct(String keyword) {
        return repo.SearchProduct(keyword);
    }

    // NEW — paginated + filtered products
    public PageResponse<Product> getProductsPaginated(
            int page,
            int size,
            String sortBy,
            String direction,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        // Build sort direction
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        // Build pageable — Spring handles LIMIT and OFFSET automatically
        Pageable pageable = PageRequest.of(page, size, sort);

        // Fetch from DB — only one page at a time
        Page<Product> productPage = repo.findAllWithFilters(
                category, minPrice, maxPrice, pageable
        );

        // Wrap in our clean response DTO
        return new PageResponse<>(
                productPage.getContent(),       // products for this page
                productPage.getNumber(),         // current page number
                productPage.getTotalPages(),     // total pages available
                productPage.getTotalElements(),  // total products in DB
                productPage.getSize(),           // page size
                productPage.isLast()             // is this the last page
        );
    }
}
