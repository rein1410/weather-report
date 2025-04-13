package models

import (
	"gorm.io/datatypes"
)

type Forecast struct {
	Dt   int64 `json:"dt" gorm:"primaryKey;uniqueIndex:idx_dt"`
	Main datatypes.JSONType[struct {
		Temp     float32 `json:"temp"`
		TempMin  float32 `json:"temp_min"`
		TempMax  float32 `json:"temp_max"`
		Pressure float32 `json:"pressure"`
		Humidity float32 `json:"humidity"`
	}] `json:"main"`
	Clouds datatypes.JSONType[struct {
		All uint32 `json:"all"`
	}] `json:"clouds"`
}
