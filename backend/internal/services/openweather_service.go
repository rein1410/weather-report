package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"weather-report/internal/models"
	pagination "weather-report/pkg"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

const openWeatherUrl = "https://api.openweathermap.org/data/2.5"

var apiKeyEnv = os.Getenv("OPENWEATHER_API_KEY")

type Coordinates struct {
	Latitude  float32 `json:"latitude"`
	Longitude float32 `json:"longitude"`
}

var changiAirportCoordinates = Coordinates{
	Latitude:  1.3586,
	Longitude: 103.9899,
}

type OpenWeatherService struct {
	db         *gorm.DB
	pagination *PaginationService
}

func NewOpenWeatherService(db *gorm.DB) *OpenWeatherService {
	return &OpenWeatherService{db: db, pagination: NewPaginationService(db)}
}

func (s *OpenWeatherService) GetDailyForecast() (pagination.PaginationResponse, error) {
	result, err := s.callApiInternal(changiAirportCoordinates)
	if err != nil {
		return pagination.PaginationResponse{}, err
	}
	go s.generateHistory(result)

	return result, nil
}

func (s *OpenWeatherService) GetHistory(request pagination.QueryOptions) (*pagination.PaginationResponse, error) {
	var forecasts []models.Forecast
	response, err := s.pagination.QueryAndPaginate(forecasts, &request)
	if err != nil {
		return nil, err
	}
	return response, nil
}

func (s *OpenWeatherService) generateHistory(respose pagination.PaginationResponse) {
	// Bulk insert the data, skip any that violates unique constraint
	tx := s.db.Clauses(clause.OnConflict{DoNothing: true}).CreateInBatches(respose.List, 100)
	if tx.Error != nil {
		fmt.Println("Error saving data to database:", tx.Error)
	}
}

func (s *OpenWeatherService) callApiInternal(coords Coordinates) (pagination.PaginationResponse, error) {
	url := fmt.Sprintf("%s/forecast?lat=%f&lon=%f&appid=%s", openWeatherUrl, coords.Latitude, coords.Longitude, apiKeyEnv)
	resp, err := http.Get(url)
	if err != nil {
		return pagination.PaginationResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return pagination.PaginationResponse{}, fmt.Errorf("OpenWeather API request failed with status: %d", resp.StatusCode)
	}

	var result map[string]interface{}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return pagination.PaginationResponse{}, fmt.Errorf("error parsing JSON: %w", err)
	}
	// Map the data to the DailyForecastResponse struct
	list, err := s.mapToForecast(result)
	if err != nil {
		return pagination.PaginationResponse{}, err
	} else {
		return pagination.PaginationResponse{List: list}, nil
	}

}

func (s *OpenWeatherService) mapToForecast(data map[string]interface{}) ([]*models.Forecast, error) {
	list, ok := data["list"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("error parsing list")
	}
	var results []*models.Forecast
	for _, val := range list {
		forecast := &models.Forecast{}
		results = append(results, forecast)
		if data, ok := val.(map[string]interface{}); ok {
			raw, err := json.Marshal(data)
			if err != nil {
				return nil, fmt.Errorf("error marshaling raw data: %w", err)
			}
			forecast.Raw = raw
			if dt, ok := data["dt"].(float64); ok {
				forecast.Dt = int64(dt)
			}
			if main, ok := data["main"].(map[string]interface{}); ok {
				if temp, ok := main["temp"].(float64); ok {
					forecast.Temp = float32(temp)
				}
				if pressure, ok := main["pressure"].(float64); ok {
					forecast.Pressure = float32(pressure)
				}
				if humidity, ok := main["pressure"].(float64); ok {
					forecast.Humidity = float32(humidity)
				}
			}
			if clouds, ok := data["clouds"].(map[string]interface{})["all"].(float64); ok {
				forecast.Clouds = uint32(clouds)
			}
		}
	}

	return results, nil
}
