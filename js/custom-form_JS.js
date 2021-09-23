var customForm = {
    init: function () {
        document.querySelector('.field-validate.field-tag, .field-required.field-tag').addEventListener('blur change', function () {
            customForm.fieldValidate(this);
        });
        document.querySelector('.field-validate.field-tag').addEventListener('focus', function () {
            customForm.fieldDesc(this);
        });
        document.querySelector('.field-tag.select-field').removeEventListener('click').addEventListener('click', function (e) {
            customForm.materialSelectField(this);
        });
		document.querySelector('.field-tag.select-field').removeEventListener('keypress', function (e) {
            e.preventDefault();
        });
        document.querySelector('.field-tag.radio-field').removeEventListener('click').addEventListener('click', function (e) {
            customForm.materialRadioField(this);
        });
        document.querySelector('.select-field-set.default-select').each(function (index, value) {
            var $thisInputField = document.querySelector(value).querySelector('input');
            $thisDataListID = $thisInputField.attr('data-list'),
                $thisOrginalFieldID = $thisInputField.attr('data-orginalField'),
                $thisDataListValue = document.querySelector('#' + $thisDataListID).querySelector('option:selected').value || document.querySelector('#' + $thisDataListID).querySelector('option:first').value,
                $thisDataListText = document.querySelector('#' + $thisDataListID).querySelector('option:selected').text() || document.querySelector('#' + $thisDataListID).querySelector('option:first').text();
            $thisInputField.val($thisDataListValue);
            document.querySelector('#' + $thisOrginalFieldID + ' option:first-child').val($thisDataListValue);
            document.querySelector('#' + $thisOrginalFieldID + ' option:first-child').html($thisDataListText);
            document.querySelector(value).querySelector('.field-additional-label').html($thisDataListText);
        });
    },
    fieldValidate: function ($this) {
        var $thisTag = $this,
            $thisID = $this.attr('id'),
            $thisName = $this.attr('name'),
            $thisType = $this.attr('type'),
            $thisVal = ($thisType == 'checkbox' || $thisType == 'radio') ? document.querySelector('input[name$="' + $thisName + '"]:checked').value : $this.value,
            $thisFieldPattern = $this.attr('data-pattern'),
            $thisPattern = '^(' + $thisFieldPattern + ')$',
            $thisPatternRemove = '/' + $thisFieldPattern + '/gm',
            $thisParent = $this.parents('.field-set'),
            $thisHelper = $thisParent.querySelector('.field-helper'),
            $thisPatternValidate = $this.classList.contains('field-validate'),
            $thisRequired = $this.classList.contains('field-required');
        if (!$thisTag.is(':visible')) {
            return false;
        }
        if ($thisRequired == true && ($thisVal == "" || $thisVal === undefined)) {
            if ($thisType == 'checkbox' || $thisType == 'radio') {
                $thisParent.classList.add('validation-error');
                $thisParent.removeClass('validation-success');
                return false;
            }
            $thisHelper.html("Required");
            $thisParent.classList.add('validation-error');
            $thisParent.removeClass('validation-success');
            return false;
        } else {
            $thisHelper.html("");
            $thisParent.classList.add('validation-success');
            $thisParent.removeClass('validation-error');
        }
        if ($thisType == 'checkbox' || $thisType == 'radio' || $thisType == 'file' || $thisType == 'select' || $thisType == 'submit') {
            return false;
        }
        if ($thisVal.substring(0, 1) == " ") {
            $thisHelper.html("First letter should not be space");
            $thisParent.classList.add('validation-error');
            $thisParent.removeClass('validation-success');
            return false;
        } else {
            $thisHelper.html("");
            $thisParent.classList.add('validation-success');
            $thisParent.removeClass('validation-error');
        }
        if ($thisVal.length <= 0) {
            return false;
        }
        if ($thisPatternValidate != true) {
            return false;
        }
        if (($thisPattern != "" && $thisPattern != undefined)) {
            if (!$thisVal.match($thisPattern)) {
                var valueToRemove = $thisVal.replace(eval($thisPatternRemove), ''),
                    errorMessage = "Need to match requirment";
                if (valueToRemove != "") {
                    if ($thisID.toUpperCase().indexOf("MAIL") < 0) {
                        errorMessage += "<span class='to-remove-text' data-fieldId='" + $thisID + "' data-fieldPattern='" + $thisFieldPattern + "'>Remove:&nbsp;<span class='remove-text'>" + valueToRemove + "</span></span>";
                    } else {
                        errorMessage += "<span class='to-remove-suggestion'>&nbsp;Remove:&nbsp;<span class='remove-text'>" + valueToRemove + "</span></span>";
                    }
                }
                $thisHelper.html(errorMessage);
                customForm.fieldRemoveText();
                $thisParent.classList.add('validation-error');
                $thisParent.removeClass('validation-success');
                return false;
            } else {
                $thisHelper.html("");
                $thisParent.classList.add('validation-success');
                $thisParent.removeClass('validation-error');
            }
        }
    },
    formValidate: function ($this) {
        $this.querySelector('.field-validate.field-tag, .field-required.field-tag').each(function (index, field) {
            customForm.fieldValidate(document.querySelector(field));
        });
    },
    valid: function ($this) {
        customForm.formValidate($this);
        return ($this.querySelector('.validation-error').length <= 0) ? true : false;
    },
    fieldRemoveText: function () {
        document.querySelector('.field-set .field-helper .to-remove-text').removeEventListener('click').addEventListener('click', function () {
            var $thisTag = document.querySelector(this),
                $thisFieldID = $thisTag.attr('data-fieldId'),
                $thisFieldPattern = $thisTag.attr('data-fieldPattern'),
                $thisFieldValue = document.querySelector('#' + $thisFieldID).value,
                fieldPatternSubString0 = $thisFieldPattern.substr(0, 1),
                fieldPatternSubStringNon0 = $thisFieldPattern.substr(1),
                fieldPatternIndex = $thisFieldPattern.lastIndexOf("{"),
                fieldPatternSubStringNon0 = fieldPatternSubStringNon0.substr(0, fieldPatternIndex - 1),
                $thisPatternReplace = '/' + fieldPatternSubString0 + '^' + fieldPatternSubStringNon0 + '/gm',
                valueToReplace = $thisFieldValue.replace(eval($thisPatternReplace), '');
            document.querySelector('#' + $thisFieldID).val(valueToReplace);
            document.querySelector('#' + $thisFieldID).trigger('blur');
        });
    },
    fieldDesc: function ($this) {console.log($this);
        var $thisTag = $this,
            $thisType = $this.attr('type'),
            $thisPatternDesc = $this.attr('data-patternDesc'),
            $thisParent = $this.parents('.field-set'),
            $thisHelper = $thisParent.querySelector('.field-helper');
        if ($thisType == 'checkbox' || $thisType == 'radio') {
            return false;
        }
        if ($thisPatternDesc != "" && $thisPatternDesc != undefined) {
            $thisHelper.html($thisPatternDesc);
            $thisHelper.show();
        }
    },
    materialSelectField: function ($this) {
        var $thisTag = $this,
            $thisID = $this.attr('id'),
            $thisVal = $this.value,
            $thisDataList = $this.attr('data-list'),
            $thisOriginalField = $this.attr('data-orginalField'),
            $thisParent = $this.parents('.field-set'),
            $thisParentForm = $this.parents('form'),
            $thisHelper = $thisParent.querySelector('.field-helper');
        document.querySelector('#' + $thisDataList).css({ 'display': 'inline-block' });
        $thisParentForm.css({ 'position': 'relative' });

        document.querySelector('#' + $thisDataList + ' option').addEventListener('click', function () {
            var $thisOptionValue = document.querySelector(this).value,
                $thisOptionText = document.querySelector(this).text();
            $this.val($thisOptionValue);
            if ($thisOptionValue == "" || $thisOptionValue == "null") {
                $thisParent.querySelector('.field-additional-label').html("");
                document.querySelector('#' + $thisID).value;
                document.querySelector('#' + $thisDataList + ' option:selected').prop('selected', false);
            } else {
                $thisParent.querySelector('.field-additional-label').html($thisOptionText);
                document.querySelector('#' + $thisID).val($thisOptionValue);
                document.querySelector('#' + $thisDataList + ' option:selected').prop('selected', false);
                document.querySelector(this).prop('selected', true);
            }
            $thisParent.querySelector('#' + $thisOriginalField + ' option:first-child').val($thisOptionValue);
            $thisParent.querySelector('#' + $thisOriginalField + ' option:first-child').html($thisOptionText);

            document.querySelector('#' + $thisOriginalField).trigger('change');
            document.querySelector('#' + $thisDataList).css({ 'display': 'none' });
            $thisParentForm.css({ 'position': 'unset' });
            customForm.fieldValidate($thisTag);
            document.querySelector('body').unbind('click.mynamespace');
			document.querySelector('body').unbind('keypress.mynamespace');
        });
        setTimeout(function () {
            document.querySelector('body').addEventListener('click.mynamespace keypress.mynamespace', function (e) {
                //e.preventDefault();
                document.querySelector('#' + $thisDataList).css({ 'display': 'none' });
                $thisParentForm.css({ 'position': 'unset' });
                document.querySelector('body').unbind('click.mynamespace');
				document.querySelector('body').unbind('keypress.mynamespace');
                document.querySelector('html').trigger('click');
                $thisTag.trigger('blur');
            });
        }, 300);
    },
    materialRadioField: function ($this) {
        var $thisTag = $this,
            $thisID = $this.attr('id'),
            $thisVal = $this.value,
            $thisName = $this.attr('name'),
            $thisParent = $this.parents('.field-set'),
            $thisParentForm = $this.parents('form'),
            $thisHelper = $thisParent.querySelector('.field-helper'),
            $thisVal_ = $this.attr('data-value'),
            fieldValue = "";
        document.querySelector('.field-tag.radio-field[name$="' + $thisName + '"]').each(function (index, value) {
            fieldValue = document.querySelector(value).value;
            if (fieldValue != "") {
                document.querySelector(value).attr('data-value', fieldValue);
                document.querySelector(value).value;
            }
        });
        $this.val($thisVal_);
    }
};
