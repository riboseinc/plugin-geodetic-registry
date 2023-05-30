/** @jsx jsx */

import { jsx, css } from '@emotion/react';
import { ItemClassConfiguration, ItemListView } from '@riboseinc/paneron-registry-kit/types';
import { PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import GenericRelatedItemView from '@riboseinc/paneron-registry-kit/views/GenericRelatedItemView';
import {
  FormGroup,
  TextArea,
} from '@blueprintjs/core';



import {
  CommonGRItemData,
  DEFAULTS as SHARED_DEFAULTS,
  EditView as CommonEditView,
  ListItemView as CommonListItemView,
  DetailView as CommonDetailView,
  COMMON_PROPERTIES,
  AliasesDetail,
  textInputProps,
} from './common';


export interface CoordinateOpMethod extends CommonGRItemData {
  aliases: string[]
  parameters: string[]
  formula: string
}

export const DEFAULTS: CoordinateOpMethod = {
  ...SHARED_DEFAULTS,
  aliases: [],
  parameters: [],
  formula: '',
};


export const coordinateOpMethod: ItemClassConfiguration<CoordinateOpMethod> = {
  ...COMMON_PROPERTIES,
  meta: {
    title: "Coordinate Operation Method",
    description: "Coordinate Operation Method",
    id: 'coordinate-op-method',
    alternativeNames: [],
  },
  defaults: {
    ...SHARED_DEFAULTS,
    ...DEFAULTS,
  },
  views: {
    listItemView: CommonListItemView as ItemListView<CoordinateOpMethod>,
    detailView: (props) => {
      const data = props.itemData;

      return (
        <CommonDetailView {...props}>

          {(data.aliases || []).length > 0
            ? <AliasesDetail aliases={data.aliases} />
            : null}

          {(data.formula || '').length > 0
            ? <PropertyDetailView title="Formula">
                <p>{data.formula}</p>
              </PropertyDetailView>
            : null}

          {(data.parameters || []).length > 0
            ? <PropertyDetailView title="Parameters">
                {data.parameters.map(paramID =>
                  <GenericRelatedItemView
                    css={css`margin-bottom: 1em;`}
                    getRelatedItemClassConfiguration={props.getRelatedItemClassConfiguration}
                    itemRef={{ classID: 'coordinate-op-parameter', itemID: paramID }}
                    useRegisterItemData={props.useRegisterItemData}
                  />
                )}
              </PropertyDetailView>
            : null}

        </CommonDetailView>
      )
    },
    editView: (props) => (
      <CommonEditView
        useRegisterItemData={props.useRegisterItemData}
        getRelatedItemClassConfiguration={props.getRelatedItemClassConfiguration}
        itemData={props.itemData}
        itemRef={props.itemRef}
        onChange={props.onChange ? (newData: CommonGRItemData) => {
          if (!props.onChange) { return; }
          props.onChange({ ...props.itemData, ...newData });
        } : undefined}>

        <FormGroup label="Formula">
          <TextArea fill required value={props.itemData.formula} {...textInputProps(props)('formula')} />
        </FormGroup>
      </CommonEditView>
    ),
  },

  validatePayload: async () => true,
  sanitizePayload: async (t) => t,
};
