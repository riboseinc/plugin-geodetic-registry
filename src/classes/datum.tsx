/** @jsx jsx */
/** @jsxFrag React.Fragment */

import update from 'immutability-helper';
import { jsx } from '@emotion/react';
import { TextArea, InputGroup } from '@blueprintjs/core';
import type { ItemClassConfiguration, ItemEditView, ItemListView } from '@riboseinc/paneron-registry-kit/types';
import { PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';

import {
  type Extent,
  ExtentEdit,
  DEFAULT_EXTENT,
} from './extent';
import {
  type CommonGRItemData,
  DEFAULTS as SHARED_DEFAULTS,
  EditView as CommonEditView,
  ListItemView as CommonListItemView,
  COMMON_PROPERTIES,
  RelatedItem,
} from './common';


export interface DatumData extends CommonGRItemData {
  scope: string
  extent: Extent
  // A.k.a. “anchor”
  originDescription: string
  coordinateReferenceEpoch: string | null
  releaseDate: string
}

export const DATUM_DEFAULTS: DatumData = {
  ...SHARED_DEFAULTS,
  scope: '',
  extent: DEFAULT_EXTENT,
  originDescription: '',
  releaseDate: '',
  coordinateReferenceEpoch: null,
} as const;


const DatumEditView: ItemEditView<DatumData> = function (props) {
  return (
    <CommonEditView
        useRegisterItemData={props.useRegisterItemData}
        getRelatedItemClassConfiguration={props.getRelatedItemClassConfiguration}
        itemData={props.itemData}
        itemRef={props.itemRef}
        onChange={props.onChange ? (newData: CommonGRItemData) => {
          if (!props.onChange) { return; }
          props.onChange({ ...props.itemData, ...newData });
        } : undefined}>

      {props.children}

      <PropertyDetailView
          title="Scope"
          subLabel="Description of usage, or limitations of usage, for which this item is.">
        <InputGroup
          fill
          required
          value={props.itemData.originDescription ?? ''}
          readOnly={!props.onChange}
          onChange={evt => props.onChange!({
            ...props.itemData,
            originDescription: evt.currentTarget.value,
          })}
        />
      </PropertyDetailView>

      <PropertyDetailView
          title="Publication Date"
          helperText={<code>yyyy-mm-dd</code>}
          subLabel="The date that the datum was released to the public. The date may be precise or merely a year if not well-defined.">
        <InputGroup
          fill
          required
          value={props.itemData.releaseDate ?? ''}
          readOnly={!props.onChange}
          onChange={evt => props.onChange!({
            ...props.itemData,
            releaseDate: evt.currentTarget.value,
          })}
        />
      </PropertyDetailView>

      <PropertyDetailView
          title="Coordinate reference epoch"
          helperText={<code>yyyy.y</code>}
          subLabel="The epoch applying to defining coordinates.">
        <InputGroup
          fill
          required
          value={props.itemData.coordinateReferenceEpoch ?? ''}
          readOnly={!props.onChange}
          onChange={evt => props.onChange!({
            ...props.itemData,
            coordinateReferenceEpoch: evt.currentTarget.value,
          })}
        />
      </PropertyDetailView>

      <ExtentEdit
        extent={props.itemData.extent ?? DEFAULT_EXTENT}
        onChange={props.onChange
          ? (extent) => props.onChange!(update(props.itemData, { extent: { $set: extent } }))
          : undefined}
      />

      <PropertyDetailView
          title="Anchor definition"
          subLabel="A description, possibly including coordinates of an identified point. A.k.a. “origin description”.">
        <TextArea
          fill
          required
          value={props.itemData.originDescription ?? ''}
          readOnly={!props.onChange}
          onChange={evt => props.onChange!({
            ...props.itemData,
            originDescription: evt.currentTarget.value,
          })}
        />
      </PropertyDetailView>

    </CommonEditView>
  );
};


export interface GeodeticDatumData extends DatumData {
  ellipsoid: string
  primeMeridian: string
}


export const geodeticDatum: ItemClassConfiguration<GeodeticDatumData> = {
  ...COMMON_PROPERTIES,
  meta: {
    title: "Geodetic Datum",
    description: "Geodetic Reference Frame",
    id: 'datums--geodetic',
    alternativeNames: [],
  },
  defaults: {
    ...DATUM_DEFAULTS,
    ellipsoid: '',
    primeMeridian: '',
  },
  views: {
    listItemView: CommonListItemView as ItemListView<GeodeticDatumData>,
    editView: (props) => {
      const EditView = DatumEditView as ItemEditView<GeodeticDatumData>;
      return (
        <EditView {...props}>
          <PropertyDetailView title="Ellipsoid" subLabel="Relevant ellipsoid from the registry.">
            <RelatedItem
              itemRef={props.itemData.ellipsoid
                ? { classID: 'ellipsoid', itemID: props.itemData.ellipsoid }
                : undefined
              }
              mode="id"
              onClear={props.onChange
                && (() => props.onChange!(update(props.itemData, { $unset: ['ellipsoid'] })))}
              onSet={props.onChange
                ? ((spec) => props.onChange!(update(props.itemData, { ellipsoid: spec })))
                : undefined}
              classIDs={['ellipsoid']}
            />
          </PropertyDetailView>
          <PropertyDetailView title="Prime meridian">
            <RelatedItem
              itemRef={props.itemData.primeMeridian
                ? { classID: 'prime-meridian', itemID: props.itemData.primeMeridian }
                : undefined
              }
              mode="id"
              onClear={props.onChange
                && (() => props.onChange!(update(props.itemData, { $unset: ['primeMeridian'] })))}
              onSet={props.onChange
                ? ((spec) => props.onChange!(update(props.itemData, { primeMeridian: spec })))
                : undefined}
              classIDs={['prime-meridian']}
            />
          </PropertyDetailView>
        </EditView>
      );
    },
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};


export const verticalDatum: ItemClassConfiguration<DatumData> = {
  ...COMMON_PROPERTIES,
  meta: {
    title: "Vertical Datum",
    description: "Vertical Reference Frame",
    id: 'datums--vertical',
    alternativeNames: [],
  },
  defaults: {
    ...DATUM_DEFAULTS,
  },
  views: {
    listItemView: CommonListItemView as ItemListView<DatumData>,
    editView: DatumEditView as ItemEditView<DatumData>,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};


export const engineeringDatum: ItemClassConfiguration<DatumData> = {
  ...COMMON_PROPERTIES,
  meta: {
    title: "Engineering Datum",
    description: "Engineering Reference Frame",
    id: 'datums--engineering',
    alternativeNames: [],
  },
  defaults: {
    ...DATUM_DEFAULTS,
  },
  views: {
    listItemView: CommonListItemView as ItemListView<DatumData>,
    editView: DatumEditView as ItemEditView<DatumData>,
  },
  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};
