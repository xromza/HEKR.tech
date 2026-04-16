package com.hekr.store.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hekr.store.utils.ImageType;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


import java.time.LocalDateTime;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="images")
public class Image{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "TEXT",nullable = false)
    private String url;
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "TEXT")
    private ImageType type;
    @Column(name="sort_order")
    private Integer sortOrder;
    @Column(name="created_at")
    private LocalDateTime createdAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="product_variant_id",nullable = false)
    @JsonIgnore
    private ProductVariant variant;
}