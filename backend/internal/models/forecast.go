package models

import (
	"gorm.io/datatypes"
)

type Forecast struct {
	Dt   int64 `json:"dt" gorm:"primaryKey;uniqueIndex:idx_dt"`
	Temp datatypes.JSONType[struct {
		Min float32 `json:"min"`
		Max float32 `json:"max"`
	}] `json:"temp"`
	Pressure uint32 `json:"pressure"`
	Humidity uint32 `json:"humidity"`
	Clouds   datatypes.JSONType[struct {
		All uint32 `json:"all"`
	}] `json:"clouds"`
}
