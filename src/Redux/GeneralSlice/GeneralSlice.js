import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  general: {},
  loading: false,
  extraAddOn: { data: [], pagination: null, loading: false },
};

const GeneralSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    startAddOnLoading: (state) => {
      state.extraAddOn.loading = true;
    },
    addGeneral: (state, action) => {
      state.general = action.payload;
      state.loading = false;
    },
    addAddOn: (state, action) => {
      const { data, pagination } = action.payload;
      state.extraAddOn.data = data;
      state.extraAddOn.pagination = pagination;
      state.extraAddOn.loading = false;
    },
    updateGeneralTestimonial: (state, action) => {
      state.general.testimonial = action.payload;
    },
    removeGeneralTestimonial: (state, action) => {
      state.general.testimonial = state.general.testimonial.filter(
        (t) => t._id !== action.payload
      );
    },
    updateGeneralInfo: (state, action) => {
      const newInfo = action.payload || {};
      const currentInfo = state.general.info || {};

      state.general.info = {
        email: newInfo.email?.trim() || currentInfo.email,
        contact: newInfo.contact || currentInfo.contact,
        waContact: newInfo.waContact || currentInfo.waContact,
        address: newInfo.address?.trim() || currentInfo.address,
        socialmedia: {
          facebook:
            newInfo.facebook?.trim() ||
            currentInfo.socialmedia?.facebook ||
            "#",
          instagram:
            newInfo.instagram?.trim() ||
            currentInfo.socialmedia?.instagram ||
            "#",
          twitter:
            newInfo.twitter?.trim() || currentInfo.socialmedia?.twitter || "#",
        },
        appLink: {
          IOS: newInfo.IOS?.trim() || currentInfo.appLink?.IOS || "#",
          Android:
            newInfo.Android?.trim() || currentInfo.appLink?.Android || "#",
        },
      };
    },
    addGeneralSlides: (state, action) => {
      state.general.slides = action.payload;
    },
    removeGeneralSlides: (state, action) => {
      state.general.slides = state.general.slides.filter(
        (s) => s._id !== action.payload
      );
    },
    updateGSTStatus: (state, action) => {
      state.general.GST.status = action.payload;
    },
    addNewAddOnData: (state, action) => {
      state.extraAddOn.data = action.payload;
    },
    removeAddOnData: (state, action) => {
      const idToRemove = action.payload;
      state.extraAddOn.data = state.extraAddOn.data.filter(
        (item) => item._id !== idToRemove
      );
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    stopAddOnLoading: (state) => {
      state.extraAddOn.loading = false;
    },
    resetGeneral: () => initialState,
  },
});

export const {
  startLoading,
  startAddOnLoading,
  addAddOn,
  addGeneral,
  addNewAddOnData,
  updateGeneralInfo,
  updateGeneralTestimonial,
  removeGeneralTestimonial,
  addGeneralSlides,
  removeGeneralSlides,
  updateAddOnData,
  removeAddOnData,
  stopLoading,
  stopAddOnLoading,
  updateGSTStatus,
  resetGeneral,
} = GeneralSlice.actions;
export default GeneralSlice.reducer;
