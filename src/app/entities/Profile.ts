export class Profile {
    // Inf Histórico:
    pkPrflId: String;
    prflName: String; // perfil
    prflJsonFile: JSON;
    prflLoginRegister: String; // usuario mod
    prflDateRegister: String; // fecha mod
    prflKey: String;
    prflLoginCreate: String; // cuenta
    prflDateCreate: String;
    // Inf Productos:
    pkProdId: String;
    prodName: String;
    prodActive: String;
    prodLoginCreate: String;
    prodDateCreate: String;
    prflStatus: Boolean;
    // Inf Modulos:
    pkPrmoId: String;
    prmoName: String;
    pkPropId: String;
    fkPrmoId: String;
    pkPrflIdBoss: String;
    isAssigned: boolean;
}
