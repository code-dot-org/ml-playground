/* React component to handle selecting columns as features. */
import { connect } from "react-redux";
import { styles } from "../constants";
import { addSelectedFeature } from "../redux";
import I18n from "../i18n";

interface AddFeatureButtonProps {
  column?: string;
  addSelectedFeature: (column: string) => void;
}

function AddFeatureButton({ column, addSelectedFeature }: AddFeatureButtonProps) {
  const addFeature = (event: React.MouseEvent, column: string) => {
    addSelectedFeature(column);
    event.preventDefault();
  };

  return (
    <button
      id="uitest-add-feature-button"
      type="button"
      onClick={event => addFeature(event, column)}
      style={styles.selectFeaturesButton}
    >
      {I18n.t("addFeatureButton")}
    </button>
  );
}

export default connect(
  (state: any) => ({}),
  dispatch => ({
    addSelectedFeature(column: string) {
      dispatch(addSelectedFeature(column));
    }
  })
)(AddFeatureButton);
