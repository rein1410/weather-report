package main

import (
	"log"
	"net/http"
	"time"
	"weather-report/internal/database"
	"weather-report/internal/models"
	"weather-report/internal/routes"

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
			routes.GetDailyForecast(c, db)
		})
		api.GET("/history", func(c *gin.Context) {
			routes.GetHistory(c, db)
		})
	}

	// Start the server
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
