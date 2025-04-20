package routes

import (
	"net/http"
	"weather-report/internal/services"

	pagination "weather-report/pkg"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetDailyForecast(c *gin.Context, db *gorm.DB) {
	openweatherService := services.NewOpenWeatherService(db)
	response, err := openweatherService.GetDailyForecast()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, response)
}

func GetHistory(c *gin.Context, db *gorm.DB) {
	config := pagination.EndpointConfig{
		AllowedFilters: map[string]bool{
			"dt":       true,
			"temp":     true,
			"pressure": true,
			"humidity": true,
			"clouds":   true,
		},
		AllowedSorts: map[string]bool{
			"dt":       true,
			"temp":     true,
			"pressure": true,
			"humidity": true,
			"clouds":   true,
		},
	}
	openweatherService := services.NewOpenWeatherService(db)
	options, err := pagination.ParseQueryOptions(c, config)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	response, err := openweatherService.GetHistory(options)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, response)
}
