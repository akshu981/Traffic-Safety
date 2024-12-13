library(dplyr)

cat("Please enter the path to the input CSV file: ")
input_path <- readline()

cat("Please enter the path to save the cleaned CSV file: ")
output_path <- readline()

vehicle_crash_data <- read.csv(input_path, stringsAsFactors = FALSE)

vehicle_crash_transposed <- t(vehicle_crash_data[, -1])  # Exclude the first column during transpose
colnames(vehicle_crash_transposed) <- vehicle_crash_data[, 1]  # Use the first column as new column names
vehicle_crash_transposed <- as.data.frame(vehicle_crash_transposed)

vehicle_crash_transposed <- vehicle_crash_transposed |>
  mutate(Year = rownames(vehicle_crash_transposed)) |>
  relocate(Year)

rownames(vehicle_crash_transposed) <- NULL
vehicle_crash_transposed$Year <- gsub("^X", "", vehicle_crash_transposed$Year) |> as.numeric()

vehicle_crash_transposed <- vehicle_crash_transposed |>
  arrange(Year)

colnames(vehicle_crash_transposed) <- gsub("&nbsp;&nbsp;Motorcyclists", "Motorcyclists", colnames(vehicle_crash_transposed))

columns_to_remove <- c(
  "Motor Vehicle Traffic Crashes",
  "Traffic Crash Fatalities",
  "Vehicle Occupants",
  "&nbsp;&nbsp;Nonmotorists",
  "Other National Statistics",
  "National Rates: Fatalities",
  "V1"
)

vehicle_crash_transposed <- vehicle_crash_transposed |>
  select(-all_of(columns_to_remove))

vehicle_crash_transposed <- vehicle_crash_transposed |>
  filter(!Year %in% c("isHeader"))

vehicle_crash_transposed <- vehicle_crash_transposed |>
  slice(1:(n() - 1))

write.csv(vehicle_crash_transposed, output_path, row.names = FALSE)

cat("Data cleaning complete. Cleaned file saved to: ", output_path, "\n")