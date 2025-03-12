package util

func Keys[T interface{}](list map[string]T) []T {
	var slice []T

	for _, value := range list {
		slice = append(slice, value)
	}

	return slice
}
