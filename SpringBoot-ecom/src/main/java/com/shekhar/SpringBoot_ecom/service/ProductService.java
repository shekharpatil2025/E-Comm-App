package com.shekhar.SpringBoot_ecom.service;

import com.shekhar.SpringBoot_ecom.model.Product;
import com.shekhar.SpringBoot_ecom.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;
    public List<Product> getAllProducts() {
        return repo.findByProductAvailableTrue();
    }

    public Product getProductById(int id) {
        return repo.findById(id).get();
    }

    public Product addOrUpdateProduct(Product product, MultipartFile image) throws IOException {
        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());
        return repo.save(product);
    }

    public void deleteProduct(int id) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Soft delete — mark as unavailable instead of removing from DB.
        // Hard delete breaks FK constraint if product has been ordered before.
        product.setProductAvailable(false);
        product.setStockQuantity(0);
        repo.save(product);
    }

    public List<Product> SearchProduct(String keyword) {
        return repo.SearchProduct(keyword);
    }
}
