class Pet {
    constructor(name, species, age, sex, weight) {
        this.name = name;
        this.species = species;
        this.age = age;
        this.sex = sex;
        this.weight = weight;
    }

    getName() {
        return this.name;
    }

    getSpecies() {
        return this.species;
    }
    getAge() {
        return this.age;
    }

    getSex() {
        return this.sex;
    }

    getWeight() {
        return this.weight;
    }
}