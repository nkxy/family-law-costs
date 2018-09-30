import { createStructuredSelector, createSelector } from "reselect";
import { path, pipe } from "ramda";
import { selectPersonas } from "src/scenes/personas/store/personas.selectors";
import {
  createPersonasObject,
  numberToMoneyDisplay,
  pathnameToPersona
} from "./persona-page.utils";
import { LEGAL_AID_CUTOFF, LEGAL_AID_ELIGIBILITY } from "src/data/by-province";
import { NUMBER_OF_COURT_EVENTS, TRANSPORT_FEES } from "src/data/by-province";
import { COST_OF_CHILDCARE_PER_DAY, MOVING_FEES } from "src/data/by-province";
import {
  LEGAL_FEES,
  COURT_FEES_BY_STAGE,
  PROFESSIONAL_FEES
} from "src/data/by-province";
import { capitalize } from "../../../utils";

const selectCurrentPersonaName = pipe(
  path(["router", "location", "pathname"]),
  pathnameToPersona
);

const selectPersonasByName = createSelector(
  selectPersonas,
  createPersonasObject
);

const selectCurrentPersona = createSelector(
  selectCurrentPersonaName,
  selectPersonasByName,
  (name, personas) => personas[name]
);

const selectPersonaPage = path(["personaPage"]);

const selectPersonaIncome = createSelector(selectPersonaPage, path(["income"]));
const selectHasLawyer = createSelector(selectPersonaPage, path(["hasLawyer"]));
const selectProvince = createSelector(selectPersonaPage, path(["province"]));
const selectLocationType = createSelector(selectPersonaPage, personaPageData =>
  path(["locationType"])(personaPageData)
);
const selectModalIsOpen = createSelector(
  selectPersonaPage,
  path(["modalIsOpen"])
);

const selectPersonaIncomeDisplay = createSelector(
  selectPersonaIncome,
  numberToMoneyDisplay
);

const selectIsEligibleForLegalAid = createSelector(
  selectPersonaIncome,
  selectProvince,
  selectCurrentPersona,
  (income, province, persona) => {
    return (
      income <= LEGAL_AID_CUTOFF[province][persona.children] &&
      LEGAL_AID_ELIGIBILITY[persona.stage]
    );
  }
);

const selectReasonsForLegalAidEligibility = createSelector(
  selectPersonaIncome,
  selectProvince,
  selectCurrentPersona,
  (income, province, persona) => {
    let reasons = [];
    if (income > LEGAL_AID_CUTOFF[province][persona.children]) {
      reasons.push(
        `${capitalize(persona.pronouns.possessive)}
        income is above the legal aid cut-off in
        ${persona.pronouns.possessive} province.`
      );
    }
    if (!LEGAL_AID_ELIGIBILITY[persona.stage]) {
      reasons.push(
        `Legal aid in
        ${persona.pronouns.possessive}
        province does not cover this type of proceeding.`
      );
    }
    else  {  reasons.push(
        `${capitalize(persona.name)}
         is eligible for legal aid!`)
       }
    return reasons;
  }
);

const selectTransportationFees = createSelector(
  selectCurrentPersona,
  selectLocationType,
  (persona, locationType) => {
    const numberOfCourtEvents = NUMBER_OF_COURT_EVENTS[persona.stage];
    const fees = TRANSPORT_FEES[locationType] * numberOfCourtEvents;
    return fees;
  }
);

const selectTransportationFeesDisplay = createSelector(
  selectTransportationFees,
  fees => (isNaN(fees) ? "" : numberToMoneyDisplay(fees))
);

const selectLegalFees = createSelector(
  selectCurrentPersona,
  selectHasLawyer,
  selectIsEligibleForLegalAid,
  selectProvince,
  (persona, withLawyer, isEligibleForLegalAid, province) => {
    const lawyerFees = withLawyer
      ? LEGAL_FEES[persona.stage] * persona.conflictMultiplier
      : 0;
    const legalAid = isEligibleForLegalAid ? lawyerFees : 0;
    const professionalCourtFees =
      COURT_FEES_BY_STAGE[province][persona.stage] +
      PROFESSIONAL_FEES[persona.stage];
    const legalFees = lawyerFees - legalAid + professionalCourtFees;
    return legalFees;
  }
);

const selectLegalFeesDisplay = createSelector(
  selectLegalFees,
  numberToMoneyDisplay
);

const selectCostsOfTheCase = createSelector(
  selectLegalFees,
  selectTransportationFees,
  (legalFees, transportationFees) => legalFees + transportationFees
);

const selectMovingFees = createSelector(
  selectCurrentPersona,
  selectProvince,
  (persona, province) => numberToMoneyDisplay(MOVING_FEES[province])
);

const selectChildcareFees = createSelector(
  selectCurrentPersona,
  selectProvince,
  (persona, province) =>
    numberToMoneyDisplay(
      10 * COST_OF_CHILDCARE_PER_DAY[province] * persona.children
    )
);

const selectTotalDirectFees = createSelector(selectCurrentPersona, () =>
  numberToMoneyDisplay(90000)
);

const selectDaysOffWork = createSelector(selectCurrentPersona, () => {
  return {
    courtDays: 5,
    sickDays: 5,
    totalDays: 10
  };
});

export const personasConnector = createStructuredSelector({
  personasByName: selectPersonasByName,
  incomeDisplay: selectPersonaIncomeDisplay,
  income: selectPersonaIncome,
  hasLawyer: selectHasLawyer,
  isEligibleForLegalAid: selectIsEligibleForLegalAid,
  eligibilityReasons: selectReasonsForLegalAidEligibility,
  locationType: selectLocationType,
  transportationFees: selectTransportationFeesDisplay,
  legalFees: selectLegalFeesDisplay,
  movingFees: selectMovingFees,
  childcareFees: selectChildcareFees,
  totalDirectFees: selectTotalDirectFees,
  modalIsOpen: selectModalIsOpen,
  daysOffWork: selectDaysOffWork,
  province: selectProvince,
  costsOfTheCase: selectCostsOfTheCase
});
