const VLDT_TYPE = {
    REQUIRED: 1,
    REG_EXP: 2
}

class VltdField {

    constructor (htmlCtrl, validations, event) {
        this.htmlCtrl = htmlCtrl;
        this.validations = validations;
        this.event = event;

        this.boundEventHandler = this.eventHandler.bind(this);
    }

    test() {
        let state = true;

        validationsBlock: {
            const qValidations = this.validations.length;
            for(let i = 0; i < qValidations; i++) {
                switch (this.validations[i].type) {
                    case VLDT_TYPE.REQUIRED:
                        if (this.htmlCtrl.value.trim() === '') {
                            state = false;
                            this.htmlCtrl.classList.add('vldt__field--invalid');
                            this.htmlCtrl.parentNode.querySelector('.vldt__caption').textContent = this.validations[i].text;
                            break validationsBlock;
                        }
                        break;
                    case VLDT_TYPE.REG_EXP:
                        if (! this.validations[i].regExp.test(this.htmlCtrl.value.trim())) {
                            state = false;
                            this.htmlCtrl.classList.add('vldt__field--invalid');
                            this.htmlCtrl.parentNode.querySelector('.vldt__caption').textContent = this.validations[i].text;
                            break validationsBlock;
                        }
                        break;
                }
            }
        }

        if (state) {
            this.htmlCtrl.classList.remove('vldt__field--invalid');
            this.htmlCtrl.parentNode.querySelector('.vldt__caption').textContent = '';
        }

        return state;
    }

    eventHandler() {
        this.test();
    }
    
    setEventListener() {
        this.htmlCtrl.addEventListener(this.event.type, this.boundEventHandler);
    }

    unsetEventListener() {
        this.htmlCtrl.removeEventListener(this.event.type, this.boundEventHandler);
    }

    unsetVldt() {
        this.htmlCtrl.classList.remove('vldt__field--invalid');
        this.htmlCtrl.parentNode.querySelector('.vldt__caption').textContent = '';
    }
}

const vldtForm = (vldtFieldsArray) => {
    let resp = true;

    vldtFieldsArray.forEach(field => {
        if (! field.test()) resp = false;
    });

    return resp;
}

const vldtSetListeners = (vldtFieldsArray) => {
    
    vldtFieldsArray.forEach(field => {
        field.setEventListener();
    });

}

const vldtUnset = (vldtFieldsArray) => {
    
    vldtFieldsArray.forEach(field => {
        field.unsetVldt();
        field.unsetEventListener();
    });

}

export {
    VltdField,
    VLDT_TYPE,
    vldtForm,
    vldtSetListeners,
    vldtUnset,
}

/*
NOTE: for call 'unsetEventListener' from a event listener: 
    element.addEventListener(eventType, () => { fieldVldtInstance.unsetEventListener(); });
*/