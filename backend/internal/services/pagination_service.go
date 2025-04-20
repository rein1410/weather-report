package services

import (
	"fmt"
	"math"
	"strings"
	pagination "weather-report/pkg"

	"gorm.io/gorm"
)

type PaginationService struct {
	db *gorm.DB
}

func NewPaginationService(db *gorm.DB) *PaginationService {
	return &PaginationService{db: db}
}

func (s *PaginationService) QueryAndPaginate(model interface{}, options *pagination.QueryOptions) (*pagination.PaginationResponse, error) {
	query := s.db.Model(model)

	// Apply filters
	for field, filters := range options.Filters {
		for operator, value := range filters {
			switch operator {
			case pagination.FilterOperatorEq:
				query = query.Where(fmt.Sprintf("%s = ?", field), value)
			case pagination.FilterOperatorGt:
				query = query.Where(fmt.Sprintf("%s > ?", field), value)
			case pagination.FilterOperatorLt:
				query = query.Where(fmt.Sprintf("%s < ?", field), value)
			case pagination.FilterOperatorGte:
				query = query.Where(fmt.Sprintf("%s >= ?", field), value)
			case pagination.FilterOperatorLte:
				query = query.Where(fmt.Sprintf("%s <= ?", field), value)
			case pagination.FilterOperatorIn:
				values := strings.Split(value, ",")
				interfaceValues := make([]interface{}, len(values))
				for i, v := range values {
					interfaceValues[i] = v
				}
				query = query.Where(fmt.Sprintf("%s IN (?)", field), interfaceValues)
			case pagination.FilterOperatorBetween:
				values := strings.Split(value, ",")
				query = query.Where(fmt.Sprintf("%s BETWEEN ? AND ?", field), values[0], values[1])
			}
		}
	}

	// Apply sorting
	for field, order := range options.Sort {
		query = query.Order(fmt.Sprintf("%s %s", field, order))
	}

	// Get total count before pagination
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	// Apply pagination
	query = query.Limit(options.Limit).Offset(options.Offset)

	// Execute query
	if err := query.Find(&model).Error; err != nil {
		return nil, err
	}

	// Calculate total pages
	totalPages := int64(math.Ceil(float64(total) / float64(options.Limit)))

	// Return pagination response
	return &pagination.PaginationResponse{
		List:       model,
		Total:      total,
		TotalPages: totalPages,
		Page:       int64(options.Offset/options.Limit + 1),
	}, nil
}
