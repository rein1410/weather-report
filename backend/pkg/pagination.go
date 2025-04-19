package pagination

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type PaginationResponse struct {
	Total      int64       `json:"total"`
	TotalPages int64       `json:"total_pages"`
	Page       int64       `json:"page"`
	List       interface{} `json:"list"`
}

type QueryOptions struct {
	Limit   int                                  `form:"limit"`
	Offset  int                                  `form:"offset"`
	Filters map[string]map[FilterOperator]string `form:"filters"`
	Sort    map[string]SortOrder                 `form:"sort"`
}

type FilterOperator string

const (
	FilterOperatorEq  FilterOperator = "eq"
	FilterOperatorGt  FilterOperator = "gt"
	FilterOperatorLt  FilterOperator = "lt"
	FilterOperatorGte FilterOperator = "gte"
	FilterOperatorLte FilterOperator = "lte"
)

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
		Sort:    make(map[string]SortOrder),
		Filters: make(map[string]map[FilterOperator]string),
	}

	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil || limit < 0 {
		limit = 10
	}
	options.Limit = limit

	page, err := strconv.Atoi(c.Query("page"))
	if err != nil || page < 0 {
		page = 0
	}
	options.Offset = page * limit

	if filterParam := c.Query("filters"); filterParam != "" {
		filters := strings.Split(filterParam, ",")
		for _, filter := range filters {
			// example: dt:eq:2025-04-19
			filter = strings.TrimSpace(filter)
			parts := strings.Split(filter, ":")
			if len(parts) != 3 {
				return QueryOptions{}, fmt.Errorf("invalid filter format: %s", filter)
			}
			key := parts[0]
			operator := parts[1]
			value := parts[2]
			if _, allowed := config.AllowedFilters[key]; !allowed {
				return QueryOptions{}, fmt.Errorf("invalid filter key: %s", key)
			}
			options.Filters[key] = make(map[FilterOperator]string)
			switch operator {
			case "eq":
				options.Filters[key][FilterOperatorEq] = value
			case "gt":
				options.Filters[key][FilterOperatorGt] = value
			case "lt":
				options.Filters[key][FilterOperatorLt] = value
			case "gte":
				options.Filters[key][FilterOperatorGte] = value
			case "lte":
				options.Filters[key][FilterOperatorLte] = value
			default:
				return QueryOptions{}, fmt.Errorf("invalid filter operator: %s", operator)
			}
		}
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
	if sortParam := c.Query("sorts"); sortParam != "" {
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
