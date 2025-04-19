package services

import (
	"fmt"
	pagination "weather-report/pkg"

	"gorm.io/gorm"
)

type QueryBuilderService struct {
	db *gorm.DB
}

func NewQueryBuilderService(db *gorm.DB) *QueryBuilderService {
	return &QueryBuilderService{db: db}
}

func (s *QueryBuilderService) Build(model interface{}, pagination *pagination.QueryOptions) *gorm.DB {
	query := s.db.Model(model).Limit(pagination.Limit).Offset(pagination.Offset)
	for field, order := range pagination.Sort {
		query = query.Order(fmt.Sprintf("%s %s", field, order))
	}
	return query
}
