package main

import (
	"log"
	"net/http"
	"time"
	"weather-report/internal/database"
	"weather-report/internal/models"
	"weather-report/internal/services"
	pagination "weather-report/pkg"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db, err := database.NewPostgresConnection()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	db.AutoMigrate(models.Models...)

	router := gin.Default()

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"time":   time.Now().Format(time.RFC3339),
		})
	})

	// API routes group
	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Welcome to the API",
			})
		})
		api.GET("/daily-forecast", func(c *gin.Context) {
			openweatherService := services.NewOpenWeatherService(db)
			response, err := openweatherService.GetDailyForecast()
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": err.Error(),
				})
				return
			}
			c.JSON(http.StatusOK, response)
		})
		api.GET("/history", func(c *gin.Context) {
			config := pagination.EndpointConfig{
				AllowedFilters: map[string]bool{
					"dt": true,
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
		})
	}

	// Start the server
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
