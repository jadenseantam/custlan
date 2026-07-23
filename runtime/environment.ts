// This file is for declaring variables

import { MK_BOOL, MK_NULL, RuntimeVal } from "./values.ts";

export function createGlobalEnv() {
    const env = new Environment()

    // declaring system variables
    env.declareVar("true", MK_BOOL(true), true)
    env.declareVar("false", MK_BOOL(false), true)
    env.declareVar("null", MK_NULL(), true)

    return env
}

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>; // map --> object, set --> array 
    private constants: Set<string>;

    constructor (parentENV?: Environment) {
        const global = parentENV ? true : false
        this.parent = parentENV
        this.variables = new Map()  
        this.constants = new Set()

    }

    public declareVar(varname: string, value: RuntimeVal, constant: boolean): RuntimeVal { // let the user to define a var
        if (this.variables.has(varname)) { // check if variable already exists (.has() checks if key exists in Map)
            throw `Cannot declare variable ${varname} as it already is defined`
        }

        this.variables.set(varname, value) // set the var

        if (constant) {
            this.constants.add(varname)
        }

        return value;
    }

    public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varname) // find the variable
        
        // cannot assign to constant
        if (env.constants.has(varname)) {
            throw `Cannot reassign to variable ${varname} as it was declared constant. `
        }

        env.variables.set(varname, value);
        return value;
    }

    public lookupVar(varname: string): RuntimeVal {
        const env = this.resolve(varname) // find the variable
        return env.variables.get(varname) as RuntimeVal // find the value of assigned variable, (as Runtimeval is for preventing TS throws RuntimeVal is undefined)
    }

    public resolve(varname: string): Environment { 
        if (this.variables.has(varname)) {
            return this // check if current scope has this variable, return current scope
        }

        if (this.parent == undefined) {
            throw `Cannot resolve '${varname}' as it does not exist.`
        } // check the parent (global scope), if not exist, throw an error

        return this.parent.resolve(varname) 
    }
}

/*
KNOWLEDGE LEARNT
1. Parent (global scope)
2. Variables is a Map
3. Declare variable
4. Assign & resolve variable
5. Lookup variable (get the value of variable) 
*/