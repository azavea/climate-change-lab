import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';

import { MapsAPILoader } from '@agm/core';
import { City } from 'climate-change-components';
import { Point } from 'geojson';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { MapCell } from '../../models/map-cell.model';
import { MapCellService } from '../../services/map-cell.service';
import { apiHost } from '../../constants';
import { environment } from '../../../environments/environment';

/*  City Dropdown Component

    -- Requires: input project

    Expected use:
        <ccl-city-dropdown
        [projectData]="your_project.project_data">
*/
@Component({
  selector: 'ccl-city-dropdown',
  template: `<div class="dropdown dropdown-location">
              <div class="input">
                <ng-template #cityError>
                    <i class="icon-attention"></i>
                    No climate data for this location
                </ng-template>
                <input #input
                    id="project.city"
                    class="autocomplete"
                    [ngClass]="errors === null ? '' : 'error'"
                    type="text"
                    [popover]="cityError"
                    triggers=""
                    container="body"
                    [isOpen]="errors !== null"
                    containerClass="error-popover"
                    placeholder="Enter your city" />
              </div>
            </div>`,
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CityDropdownComponent),
      multi: true,
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CityDropdownComponent),
    multi: true,
  }]
})
export class CityDropdownComponent implements OnInit, ControlValueAccessor, Validator {

    @ViewChild('input') input: ElementRef;

    public errors: ValidationErrors = null;

    private autocomplete: google.maps.places.Autocomplete;
    private onChange = (_: any) => { };

    constructor(private el: ElementRef, private mapsApiLoader: MapsAPILoader,
                private zone: NgZone, private mapCellService: MapCellService) {}

    ngOnInit() {
      try {
           this.setupAutocomplete();
        } catch (error) {
            this.mapsApiLoader.load().then(() => this.setupAutocomplete());
        }
    }

    writeValue(city: any) {
        if (city && city.properties) {
            this.errors = null;
            this.input.nativeElement.value = `${city.properties.name}, ${city.properties.admin}`;
        }
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    // Required by interface, not used
    registerOnTouched(fn: any) {}

    validate(c: FormControl): ValidationErrors {
        return this.errors;
    }

    private setupAutocomplete() {
        const options = {
            types: ['(cities)']
        };
        this.autocomplete = new google.maps.places.Autocomplete(this.input.nativeElement, options);
        this.autocomplete.addListener('place_changed', () => this.onPlaceChanged());

        const forceAutocompleteOff = () => {
            // Chrome ignores 'autocomplete="off"' but will turn off autocomplete for
            // invalid options. Google Places sets 'autocomplete="off"' regardless of
            // what was set on the <input> before, so we need to override that in JS
            this.input.nativeElement.autocomplete = 'forced-false';
            this.input.nativeElement.removeEventListener('focus', forceAutocompleteOff);
        };
        this.input.nativeElement.addEventListener('focus', forceAutocompleteOff);
    }

    private onPlaceChanged() {
        const place = this.autocomplete.getPlace();
        const point = {
            type: 'Point',
            coordinates: [
                place.geometry.location.lng(),
                place.geometry.location.lat(),
            ]
        } as Point;

        // This event is handled outside of the Angular change detection cycle so we
        // need to emit any changes inside a zone.run handler to trigger a detection cycle
        this.zone.run(() => {
            // Unset city while API call is in progress to let parent component
            // disable creation button
            this.onChange({} as City);
        });

        this.mapCellService.nearest(point, environment.distance)
            .catch((err: Response) => {
                return Observable.of([]);
            })
            .subscribe((cells: MapCell[]) => {
                let city;
                if (cells.length > 0) {
                    this.errors = null;
                    const datasets = new Set<string>();
                    for (const cell of cells) {
                        for (const dataset of cell.properties.datasets) {
                            datasets.add(dataset);
                        }
                    }
                    city = {
                        type: 'Feature',
                        geometry: point,
                        properties: {
                            name: place.name,
                            admin: this.getAdminFromAddress(place),
                            datasets: [...datasets],
                            region: undefined
                        }
                    } as City;
                } else {
                    this.errors = { missing: true };
                    city = {} as City;
                }

                this.zone.run(() => {
                    this.onChange(city);
                });
            });
    }

    private getAdminFromAddress(address: google.maps.places.PlaceResult): string {
        let admin = '';
        address.address_components.forEach(component => {
            if (component.types.includes('administrative_area_level_1')) {
                admin = component.short_name;
            }
        });
        return admin;
    }
}
