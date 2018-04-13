#!/bin/bash


aws s3 sync ./web_site/ s3://www.space2squat.com/ --delete
