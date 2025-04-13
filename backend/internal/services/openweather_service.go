package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"weather-report/internal/models"

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
	db *gorm.DB
}

func NewOpenWeatherService(db *gorm.DB) *OpenWeatherService {
	return &OpenWeatherService{db: db}
}

type DailyForecastResponse struct {
	List []models.Forecast `json:"list"`
}

type HistoryResponse struct {
	Total int64             `json:"total"`
	List  []models.Forecast `json:"list"`
}

func (s *OpenWeatherService) GetDailyForecast() (DailyForecastResponse, error) {
	result, err := s.callApiInternal(changiAirportCoordinates)
	if err != nil {
		return DailyForecastResponse{}, err
	}
	go s.generateHistory(result)

	return result, nil
}

func (s *OpenWeatherService) GetHistory(limit int, offset int) (HistoryResponse, error) {
	var forecasts []models.Forecast
	result := s.db.Order("dt DESC").Limit(limit).Offset(offset).Find(&forecasts)
	var total int64
	s.db.Model(&models.Forecast{}).Count(&total)
	if result.Error != nil {
		return HistoryResponse{}, result.Error
	}
	return HistoryResponse{
		Total: total,
		List:  forecasts,
	}, nil
}

func (s *OpenWeatherService) generateHistory(respose DailyForecastResponse) {
	// Bulk insert the data, skip any that violates unique constraint
	tx := s.db.Clauses(clause.OnConflict{DoNothing: true}).CreateInBatches(respose.List, 100)
	if tx.Error != nil {
		fmt.Println("Error saving data to database:", tx.Error)
	}
}

func (s *OpenWeatherService) callApiInternal(coords Coordinates) (DailyForecastResponse, error) {
	url := fmt.Sprintf("%s/forecast?lat=%f&lon=%f&appid=%s", openWeatherUrl, coords.Latitude, coords.Longitude, apiKeyEnv)
	resp, err := http.Get(url)
	if err != nil {
		return DailyForecastResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return DailyForecastResponse{}, fmt.Errorf("OpenWeather API request failed with status: %d", resp.StatusCode)
	}

	var result DailyForecastResponse

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return DailyForecastResponse{}, err
	}

	return result, nil
}
