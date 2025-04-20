package tests

import (
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"weather-report/internal/database"
	"weather-report/internal/routes"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestDailyForecastRoute(t *testing.T) {
	// Assert OPENWEATHER_API_KEY is set
	if os.Getenv("OPENWEATHER_API_KEY") == "" {
		t.Skip("OPENWEATHER_API_KEY is not set, skipping test")
	}

	db, err := database.NewPostgresConnection()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	router := gin.Default()

	api := router.Group("/api")
	{
		api.GET("/daily-forecast", func(c *gin.Context) {
			routes.GetDailyForecast(c, db)
		})
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/daily-forecast", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	var response map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "list")
}

// Test for GET /api/history
func TestGetHistory(t *testing.T) {
	router := gin.Default()

	db, err := database.NewPostgresConnection()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	api := router.Group("/api")
	{
		api.GET("/history", func(c *gin.Context) {
			routes.GetHistory(c, db)
		})
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/history", nil)
	router.ServeHTTP(w, req)
	assert.Equal(t, 200, w.Code)
	var response map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "list")
	assert.Contains(t, response, "total")
	assert.Contains(t, response, "total_pages")
	assert.Contains(t, response, "page")
}
