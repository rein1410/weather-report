package pagination

import (
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type Pagination struct {
	Total int64 `json:"total"`
	Page  int64 `json:"page"`
}

type QueryOptions struct {
	Limit  int `form:"limit"`
	Offset int `form:"offset"`
	// Filters map[string]string    `form:"filters"`
	Sort map[string]SortOrder `form:"sort"`
}

type NumberFilter struct {
	Eq  float64 `form:"eq"`
	Gt  float64 `form:"gt"`
	Lt  float64 `form:"lt"`
	Gte float64 `form:"gte"`
	Lte float64 `form:"lte"`
}

type SortOrder string

const (
	SortOrderAsc  SortOrder = "ASC"
	SortOrderDesc SortOrder = "DESC"
)

type EndpointConfig struct {
	AllowedFilters map[string]bool // Fields that can be filtered
	AllowedSorts   map[string]bool // Fields that can be sorted
}

func ParseQueryOptions(c *gin.Context, config EndpointConfig) (QueryOptions, error) {
	options := QueryOptions{
		// Filters: make(map[string]string),
		Sort: make(map[string]SortOrder),
	}

	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil || limit < 0 {
		limit = 10
		options.Limit = limit
	}

	offset, err := strconv.Atoi(c.Query("offset"))
	if err != nil || offset < 0 {
		offset = 0
		options.Offset = offset
	}

	// Parse filters
	// for key, value := range c.Request.URL.Query() {
	// 	// Skip pagination and sort parameters
	// 	if key == "limit" || key == "offset" || key == "sort" {
	// 		continue
	// 	}

	// 	// Only allow configured filterable fields
	// 	if _, allowed := config.AllowedFilters[key]; allowed {
	// 		options.Filters[key] = value[0]
	// 	}
	// }

	// Parse sorting
	if sortParam := c.Query("sort"); sortParam != "" {
		sortFields := strings.Split(sortParam, ",")

		for _, field := range sortFields {
			field = strings.TrimSpace(field)
			order := SortOrderAsc

			// Check if it's a descending sort (prefixed with "-")
			if strings.HasPrefix(field, "-") {
				field = field[1:]
				order = SortOrderDesc
			}

			// Only allow configured sortable fields
			if _, allowed := config.AllowedSorts[field]; allowed {
				options.Sort[field] = order
			}
		}
	}

	return options, nil
}
