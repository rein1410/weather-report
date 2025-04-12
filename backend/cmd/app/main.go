package main

import (
	"log"
	"net/http"
	"time"
	"weather-report/config"
	"weather-report/internal/models"
	"weather-report/internal/services"

	"github.com/gin-gonic/gin"
)

type HistoryRequest struct {
	Limit  int `form:"limit"`
	Offset int `form:"offset"`
}

func main() {
	// Initialize database
	db, err := config.NewPostgresConnection()
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
			openweatherService := services.NewOpenWeatherService(db)
			var request HistoryRequest
			if err := c.ShouldBind(&request); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": err.Error(),
				})
				return
			}
			response, err := openweatherService.GetHistory(request.Limit, request.Offset)
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
