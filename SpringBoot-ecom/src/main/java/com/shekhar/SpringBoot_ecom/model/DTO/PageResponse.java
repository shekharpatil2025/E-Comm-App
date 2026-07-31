package com.shekhar.SpringBoot_ecom.model.DTO;

import java.util.List;

public record PageResponse<T>(
        List<T> content,        // the actual products
        int currentPage,        // which page you're on (0-based)
        int totalPages,         // total number of pages
        long totalElements,     // total number of products in DB
        int pageSize,           // how many per page
        boolean isLastPage      // true if this is the last page
) {}
